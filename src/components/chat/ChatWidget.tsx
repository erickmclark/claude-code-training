'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatWidgetProps {
  lessonTitle: string;
  lessonId: number;
  moduleTitle?: string;
  currentSection?: string;
  currentStepTitle?: string;
  quizQuestions?: string[];
}

interface AttachedImage {
  dataUrl: string; // for preview
  base64: string; // raw base64 for API
  mediaType: string;
}

type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };

interface Message {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
}

export default function ChatWidget({
  lessonTitle,
  lessonId,
  moduleTitle,
  currentSection,
  currentStepTitle,
  quizQuestions,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I can help you learn about "${lessonTitle}" and Claude Code in general. What questions do you have?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [pendingImages, setPendingImages] = useState<AttachedImage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ─── Drawer width ── user-resizable via drag handle on the left edge,
  // persisted to localStorage so it remembers across sessions.
  const DRAWER_MIN_WIDTH = 360;
  const DRAWER_MAX_WIDTH = 900;
  const DRAWER_DEFAULT_WIDTH = 480;
  const [drawerWidth, setDrawerWidth] = useState(DRAWER_DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  // Hydration-safe: SSR returns default, client reads localStorage on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('chat-widget-width');
    if (saved) {
      const n = parseInt(saved, 10);
      if (!Number.isNaN(n) && n >= DRAWER_MIN_WIDTH && n <= DRAWER_MAX_WIDTH) {
        setDrawerWidth(n);
      }
    }
  }, []);

  // Drag-to-resize: attach global mousemove/mouseup listeners while dragging.
  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e: MouseEvent) => {
      // Drawer is anchored to the right edge of the viewport. New width is
      // the distance from the mouse to the right edge.
      const nextWidth = window.innerWidth - e.clientX;
      const clamped = Math.min(DRAWER_MAX_WIDTH, Math.max(DRAWER_MIN_WIDTH, nextWidth));
      setDrawerWidth(clamped);
    };
    const handleUp = () => {
      setIsResizing(false);
      // Persist final width.
      try {
        localStorage.setItem('chat-widget-width', String(drawerWidth));
      } catch {
        // ignore localStorage failures
      }
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    // Prevent text selection while dragging.
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.body.style.userSelect = prevUserSelect;
    };
  }, [isResizing, drawerWidth]);

  // Reset the chat back to the initial greeting. Clears messages, any pending
  // images, and the current input. Does not close the drawer.
  const clearChat = () => {
    if (isStreaming) return;
    if (messages.length <= 1) return; // already empty
    const confirmed =
      typeof window === 'undefined' ||
      window.confirm('Clear this conversation? The current chat history will be discarded.');
    if (!confirmed) return;
    setMessages([
      {
        role: 'assistant',
        content: `Hi! I can help you learn about "${lessonTitle}" and Claude Code in general. What questions do you have?`,
      },
    ]);
    setInput('');
    setPendingImages([]);
  };

  // Auto-grow the textarea up to a max height. Runs on every input change.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = 240; // ~10 lines
    const nextHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keep the textarea focused whenever the chat is ready for input. This
  // covers three cases:
  //   1. User opens the drawer → cursor lands in the input immediately
  //   2. Claude finishes streaming → cursor returns to the input without
  //      the user having to click back in
  //   3. User clears the chat → cursor stays in the input for the next prompt
  // We explicitly DO NOT focus while streaming (would steal focus while
  // the user might be reading Claude's response).
  useEffect(() => {
    if (!isOpen || isStreaming) return;
    // Small delay lets the drawer open transition settle before focusing,
    // otherwise the focus ring flashes mid-animation.
    const t = setTimeout(() => {
      textareaRef.current?.focus();
    }, isOpen ? 320 : 0);
    return () => clearTimeout(t);
  }, [isOpen, isStreaming, messages.length]);

  const context = {
    lessonTitle,
    lessonId,
    moduleTitle,
    currentSection,
    currentStepTitle,
    quizQuestions,
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData?.items ?? []);
    const imageItems = items.filter((item) => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    e.preventDefault();
    const newImages: AttachedImage[] = [];
    for (const item of imageItems) {
      const file = item.getAsFile();
      if (!file) continue;
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64 = dataUrl.split(',')[1] ?? '';
      newImages.push({ dataUrl, base64, mediaType: file.type });
    }
    setPendingImages((prev) => [...prev, ...newImages]);
  };

  const removePendingImage = (index: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if ((!input.trim() && pendingImages.length === 0) || isStreaming) return;

    let userContent: string | ContentBlock[];
    if (pendingImages.length > 0) {
      const blocks: ContentBlock[] = pendingImages.map((img) => ({
        type: 'image' as const,
        source: { type: 'base64' as const, media_type: img.mediaType, data: img.base64 },
      }));
      if (input.trim()) {
        blocks.push({ type: 'text', text: input.trim() });
      }
      userContent = blocks;
    } else {
      userContent = input.trim();
    }

    const userMsg: Message = { role: 'user', content: userContent };
    const allMessages = [...messages, userMsg];
    const placeholder: Message = { role: 'assistant', content: '' };

    setMessages([...allMessages, placeholder]);
    setInput('');
    setPendingImages([]);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages, context }),
      });

      const contentType = response.headers.get('content-type') ?? '';

      if (contentType.includes('application/json')) {
        const data = (await response.json()) as { result: string };
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: data.result };
          return next;
        });
      } else {
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No readable stream');
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          const text = accumulated;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: 'assistant', content: text };
            return next;
          });
        }
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        };
        return next;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sectionLabel =
    currentSection === 'step'
      ? 'Step'
      : currentSection === 'quiz'
        ? 'Quiz'
        : currentSection === 'exercise'
          ? 'Exercise'
          : currentSection === 'intro'
            ? 'Intro'
            : null;

  return (
    <>
      {/* Backdrop — click outside the drawer to close */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {/* Right-side drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: drawerWidth,
          height: '100vh',
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          // Disable the slide transition while resizing so the drawer doesn't
          // lag behind the mouse. Width change also has a smooth default
          // transition we disable during drag.
          transition: isResizing ? 'none' : 'transform 0.3s ease, width 0.2s ease',
        }}
      >
        {/* Drag handle — 6px strip on the very left edge of the drawer.
            Click and drag horizontally to resize. */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize chat"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 6,
            height: '100%',
            cursor: 'ew-resize',
            background: isResizing ? 'var(--color-coral)' : 'transparent',
            transition: 'background 0.15s',
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            if (!isResizing) e.currentTarget.style.background = 'var(--color-coral-light)';
          }}
          onMouseLeave={(e) => {
            if (!isResizing) e.currentTarget.style.background = 'transparent';
          }}
        />
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--color-coral)',
            borderRadius: 'var(--radius-lg) 0 0 0',
            padding: '0 16px',
            height: 52,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              flex: 1,
            }}
          >
            Ask Claude
          </span>
          {sectionLabel && (
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.05em',
              }}
            >
              Viewing: {sectionLabel}
            </span>
          )}
          <button
            onClick={clearChat}
            disabled={isStreaming || messages.length <= 1}
            title="Clear conversation"
            aria-label="Clear conversation"
            style={{
              background: '#fff',
              border: 'none',
              color: 'var(--color-coral)',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              cursor: isStreaming || messages.length <= 1 ? 'not-allowed' : 'pointer',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              opacity: isStreaming || messages.length <= 1 ? 0.4 : 1,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Clear
          </button>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 18,
              cursor: 'pointer',
              padding: '0 0 0 4px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {messages.map((msg, i) => {
            const isString = typeof msg.content === 'string';
            const textPart = isString
              ? (msg.content as string)
              : (msg.content as ContentBlock[])
                  .filter((b) => b.type === 'text')
                  .map((b) => (b as { type: 'text'; text: string }).text)
                  .join('\n');
            const imageParts = isString
              ? []
              : (msg.content as ContentBlock[]).filter((b) => b.type === 'image');
            return (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: msg.role === 'user' ? '80%' : '85%',
                  backgroundColor:
                    msg.role === 'user'
                      ? 'var(--color-coral-light)'
                      : 'var(--color-sand)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color:
                    msg.role === 'user'
                      ? 'var(--color-ink)'
                      : 'var(--color-body)',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {imageParts.map((b, j) => {
                  const block = b as {
                    type: 'image';
                    source: { type: 'base64'; media_type: string; data: string };
                  };
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={j}
                      src={`data:${block.source.media_type};base64,${block.source.data}`}
                      alt="attached"
                      style={{ maxWidth: '100%', borderRadius: 'var(--radius-sm)' }}
                    />
                  );
                })}
                {textPart ? (
                  textPart
                ) : isStreaming && i === messages.length - 1 && imageParts.length === 0 ? (
                  <ThinkingDots />
                ) : null}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Pending image previews */}
        {pendingImages.length > 0 && (
          <div
            style={{
              borderTop: 'var(--border)',
              padding: '8px 14px 0',
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              flexShrink: 0,
            }}
          >
            {pendingImages.map((img, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.dataUrl}
                  alt="pending"
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                  }}
                />
                <button
                  onClick={() => removePendingImage(i)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'var(--color-ink)',
                    color: '#fff',
                    fontSize: 11,
                    lineHeight: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input row */}
        <div
          style={{
            borderTop: pendingImages.length > 0 ? 'none' : 'var(--border)',
            padding: '10px 14px',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-end',
            flexShrink: 0,
          }}
        >
          <textarea
            ref={textareaRef}
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={isStreaming}
            placeholder="Ask about this lesson... (paste images with ⌘V)"
            style={{
              flex: 1,
              minHeight: 72,
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              // Auto-grows via the useEffect above; vertical drag handle
              // kept as a fallback for users who want to set a specific size.
              resize: 'vertical',
              outline: 'none',
              color: 'var(--color-ink)',
              backgroundColor: isStreaming ? 'var(--color-sand)' : '#fff',
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || (!input.trim() && pendingImages.length === 0)}
            style={{
              width: 36,
              height: 36,
              backgroundColor: 'var(--color-coral)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor:
                isStreaming || (!input.trim() && pendingImages.length === 0) ? 'not-allowed' : 'pointer',
              opacity: isStreaming || (!input.trim() && pendingImages.length === 0) ? 0.5 : 1,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Floating chat button (visible when drawer is closed) */}
      {!isOpen && (
        <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1001 }}>
          {/* Tooltip hint that fades after 5 seconds */}
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              marginBottom: 10,
              backgroundColor: 'var(--color-ink)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 500,
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              animation: 'fadeIn 0.4s ease-out both, fadeOut 0.4s ease-in 5s both',
            }}
          >
            Stuck? Ask Claude for help
            <div style={{
              position: 'absolute',
              bottom: -5,
              right: 20,
              width: 10,
              height: 10,
              backgroundColor: 'var(--color-ink)',
              transform: 'rotate(45deg)',
            }} />
          </div>
          <style>{`@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; pointer-events: none; } }`}</style>

          {/* FAB button with label */}
          <button
            onClick={() => setIsOpen(true)}
            className="card-hover"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'var(--color-coral)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius-full)',
              padding: '12px 20px 12px 16px',
              boxShadow: '0 4px 16px rgba(204, 92, 56, 0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>✦</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600 }}>
              Need help? Ask Claude
            </span>
          </button>
        </div>
      )}
    </>
  );
}

// ─── Thinking indicator ────────────────────────────────────────
// Three dots that bounce in sequence. Rendered inside the assistant's
// message bubble while streaming hasn't returned any text yet.
function ThinkingDots() {
  return (
    <span
      aria-label="Claude is thinking"
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 0',
      }}
    >
      <style>{`
        @keyframes chatThinkingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--color-coral)',
            display: 'inline-block',
            animation: 'chatThinkingBounce 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}

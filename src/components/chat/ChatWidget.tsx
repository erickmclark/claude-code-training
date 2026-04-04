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

interface Message {
  role: 'user' | 'assistant';
  content: string;
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
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const context = {
    lessonTitle,
    lessonId,
    moduleTitle,
    currentSection,
    currentStepTitle,
    quizQuestions,
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    const allMessages = [...messages, userMsg];
    const placeholder: Message = { role: 'assistant', content: '' };

    setMessages([...allMessages, placeholder]);
    setInput('');
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
      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            width: 360,
            height: 480,
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: 'var(--color-coral)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
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
                  fontSize: 11,
                  color: '#fff',
                  backgroundColor: 'var(--color-coral-dark)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {sectionLabel}
              </span>
            )}
            <button
              onClick={() => setIsOpen(false)}
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
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {messages.map((msg, i) => (
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
                  padding: '8px 12px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color:
                    msg.role === 'user'
                      ? 'var(--color-ink)'
                      : 'var(--color-body)',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content ||
                  (isStreaming && i === messages.length - 1 ? '...' : '')}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div
            style={{
              borderTop: 'var(--border)',
              padding: '8px 12px',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-end',
              flexShrink: 0,
            }}
          >
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              placeholder="Ask about this lesson..."
              style={{
                flex: 1,
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                resize: 'none',
                outline: 'none',
                color: 'var(--color-ink)',
                backgroundColor: isStreaming ? 'var(--color-sand)' : '#fff',
                lineHeight: 1.4,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              style={{
                width: 36,
                height: 36,
                backgroundColor: 'var(--color-coral)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor:
                  isStreaming || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isStreaming || !input.trim() ? 0.5 : 1,
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
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: 'var(--color-coral)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(204, 92, 56, 0.4)',
        }}
      >
        ✦ Ask Claude
      </button>
    </>
  );
}

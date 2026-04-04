'use client';

import { useCallback, useRef, useState } from 'react';

interface XPToastProps {
  xp: number;
  message: string;
  onDone: () => void;
}

export default function XPToast({ xp, message, onDone }: XPToastProps) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const containerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && !timerRef.current) {
        timerRef.current = setTimeout(() => {
          setVisible(false);
          setTimeout(onDone, 300);
        }, 3000);
      }
    },
    [onDone]
  );

  return (
    <div
      ref={containerRef}
      className={`fixed top-20 right-6 z-[60] px-5 py-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      <p className="text-lg font-bold">+{xp} XP</p>
      <p className="text-sm text-blue-100">{message}</p>
    </div>
  );
}

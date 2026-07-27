'use client';

import { useTypewriter } from "../../boot/hooks/useTypewriter";

export function SessionReady() {
  const text = useTypewriter("SESSION READY", 40);

  return (
    <div className="mt-8 font-mono text-2xl font-bold text-green-400">
      {text}
    </div>
  );
}
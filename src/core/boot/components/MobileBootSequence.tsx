'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { useSound } from '../../shared/hooks/useSound';

interface Props {
  onComplete: () => void;
}

/** A deliberately quiet, phone-native boot handoff. */
export function MobileBootSequence({ onComplete }: Props) {
  const [ready, setReady] = useState(false);
  const { play } = useSound();

  useEffect(() => {
    play('boot', 0.24);
    const readyTimer = window.setTimeout(() => setReady(true), 1250);
    const completeTimer = window.setTimeout(onComplete, 2100);

    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, play]);

  return (
    <main className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black px-8 font-mono text-green-400 md:h-screen">
      <div className="flex w-full max-w-xs flex-col items-center">
        <div className="mb-10 border-2 border-green-400 px-8 py-5">
          <h1 className="neon-text text-4xl font-bold tracking-[0.22em]">DEVOS</h1>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-green-950" aria-label="Starting DevOS">
          <motion.div
            className="h-full origin-left rounded-full bg-green-400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
        <p className="mt-5 text-center text-xs uppercase tracking-[0.25em] text-green-300/80">
          {ready ? 'Ready' : 'Starting DevOS...'}
        </p>
      </div>
    </main>
  );
}

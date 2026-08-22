'use client';

import { useEffect, useState } from 'react';

import { welcomeWords } from '../data/welcomeWords';
import { useSound } from '../../shared/hooks/useSound';
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  onComplete: () => void;
}

export function WelcomeEngine({
  onComplete,
}: Props) {
  const [index, setIndex] = useState(0);
  const { play } = useSound();
  const isAccessGranted =
    welcomeWords[index] === "ACCESS GRANTED";

  useEffect(() => {
    const isLast = index >= welcomeWords.length - 1;

    // The closing word lands on a two-note lift; the rest tick past.
    play(isLast ? 'notify' : 'blip', isLast ? 0.3 : 0.22);

    if (isLast) {
      const timeout = setTimeout(onComplete, 1500);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 1200);


    return () => clearTimeout(timeout);
  }, [index, onComplete, play]);

  return (
    <div className="flex h-dvh items-center justify-center overflow-x-hidden bg-black px-4 md:h-screen">
      <AnimatePresence mode="wait">
        <motion.h1
          key={welcomeWords[index]}
          initial={{
            opacity: 0,
            scale: 0.85,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            scale: isAccessGranted ? 1.1 : 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            scale: 1.2,
            filter: "blur(8px)",
          }}
          transition={{
            duration: 0.6,
          }}
          className="max-w-full text-center font-mono text-4xl font-bold tracking-[0.18em] text-green-400 neon-text md:text-7xl md:tracking-[0.4em]"
        >
          {welcomeWords[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useSound } from '../../shared/hooks/useSound';

interface Props {
  start?: number;
  onComplete: () => void;
}

/**
 * Each tick gets louder rather than higher. Climbing pitch was the old way of
 * building tension and it turned the countdown into a three-note melody; the
 * same relay tick pushed harder does the job without playing a tune.
 */
const TICK_VOLUME: Record<number, number> = {
  3: 0.3,
  2: 0.38,
  1: 0.48,
};

export function CountdownEngine({
  start = 3,
  onComplete,
}: Props) {
  const [count, setCount] = useState(start);
  const { play } = useSound();

  useEffect(() => {
    if (count === 0) {
      play('transition', 0.45);
      const timeout = setTimeout(onComplete, 1000);
      return () => clearTimeout(timeout);
    }

    // Counts above 3 (a larger `start`) stay at the quietest level.
    play('blip', TICK_VOLUME[count] ?? 0.3);

    const timeout = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [count, onComplete, play]);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <h1 className="font-mono text-9xl font-bold text-green-400">
        {count}
      </h1>
    </div>
  );
}
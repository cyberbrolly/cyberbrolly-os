'use client';

import { useEffect, useState } from 'react';

interface Props {
  start?: number;
  onComplete: () => void;
}

export function CountdownEngine({
  start = 3,
  onComplete,
}: Props) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (count === 0) {
      const timeout = setTimeout(onComplete, 1000);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [count, onComplete]);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <h1 className="font-mono text-9xl font-bold text-green-400">
        {count}
      </h1>
    </div>
  );
}
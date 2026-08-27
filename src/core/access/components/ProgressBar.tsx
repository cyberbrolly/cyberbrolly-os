'use client';

import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export function ProgressBar({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let completionTimeout: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          completionTimeout = setTimeout(onComplete, 400);

          return 100;
        }

        return prev + 5;
      });
    }, 45);

    return () => {
      clearInterval(interval);
      if (completionTimeout) clearTimeout(completionTimeout);
    };
  }, [onComplete]);

  const filled = Math.floor(progress / 5);
  const empty = 20 - filled;

  return (
    <div className="font-mono text-green-400">
      [
      {"█".repeat(filled)}
      {"░".repeat(empty)}
      ] {progress}%
    </div>
  );
}

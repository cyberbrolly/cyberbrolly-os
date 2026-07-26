'use client';

import { useEffect } from 'react';

interface Props {
  label: string;
  status: string;
  onComplete?: () => void;
}

export function StatusLine({
  label,
  status,
  onComplete,
}: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete?.();
    }, 300);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  const totalWidth = 38;

  const dots = ".".repeat(
    Math.max(totalWidth - label.length - status.length, 4)
  );

  return (
    <div className="font-mono text-green-400">
      {label}
      {dots}
      {status}
    </div>
  );
}
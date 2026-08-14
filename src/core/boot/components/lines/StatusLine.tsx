'use client';

import { useEffect, useRef } from 'react';
import { useSound } from '../../../shared/hooks/useSound';

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
  const onCompleteRef = useRef(onComplete);
  const { play } = useSound();

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Relay tick as the line appears, soft confirmation as it resolves. Same
    // pitch every line, so a long POST reads as a machine working rather than
    // as a sequence of notes.
    play('blip', 0.18);

    const timeout = setTimeout(() => {
      play('beep', 0.16);
      onCompleteRef.current?.();
    }, 300);

    return () => clearTimeout(timeout);
  }, [play]);

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
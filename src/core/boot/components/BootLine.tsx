'use client';

import { useEffect } from 'react';
import { useTypewriter } from "../hooks/useTypewriter";
import { useSound } from "../../shared/hooks/useSound";
import type { BootLine as BootLineType } from "../types/boot";

interface Props {
  line: BootLineType;
  onComplete?: () => void;
}

export function BootLine({
  line,
  onComplete,
}: Props) {
  const { play } = useSound();
  const output = useTypewriter(
    line.text ?? "",
    line.typingSpeed ?? 20,
    onComplete
  );

  useEffect(() => {
    if (line.text) {
      play('type', 0.1);
    }
  }, [line.text, play]);

  return <div>{output}</div>;
}

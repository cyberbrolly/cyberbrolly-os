'use client';

import { useTypewriter } from "../hooks/useTypewriter";
import type { BootLine as BootLineType } from "../types/boot";

interface Props {
  line: BootLineType;
  onComplete?: () => void;
}

export function BootLine({
  line,
  onComplete,
}: Props) {
  const output = useTypewriter(
    line.text ?? "",
    line.typingSpeed ?? 20,
    onComplete
  );

  return <div>{output}</div>;
}

'use client';

import { useTypewriter } from "../hooks/useTypewriter";
import type { BootLine as BootLineType } from "../types/boot";

interface Props {
  line: BootLineType;
}

export function BootLine({ line }: Props) {
  const output = useTypewriter(
    line.text,
    line.typingSpeed ?? 20
  );

  return <div>{output}</div>;
}
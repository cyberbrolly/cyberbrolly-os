'use client';

import type { BootLine } from "../types/boot";
import { BootLine as AnimatedBootLine } from "./BootLine";
import { StatusLine } from "./lines/StatusLine";

interface Props {
  line: BootLine;
  onComplete?: () => void;
}

export function BootRenderer({
  line,
  onComplete,
}: Props) {
  switch (line.type) {
  
    case "status":
      return (
        <StatusLine
          label={line.label!}
          status={line.status!}
          onComplete={onComplete}
        />
      );
  
    case "text":
    default:
      return (
        <AnimatedBootLine
          line={line}
          onComplete={onComplete}
        />
      );
  }
}

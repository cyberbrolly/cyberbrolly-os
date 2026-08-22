import { Cursor } from "./Cursor";
import { BootRenderer } from "./BootRenderer";
import type { BootLine as BootLineType } from "../types/boot";

interface Props {
  lines: BootLineType[];
  onLineComplete: () => void;
}

export function BootScreen({
  lines,
  onLineComplete,
}: Props) {
  return (
    <div className="flex h-dvh w-full items-center overflow-x-hidden bg-black px-4 py-8 md:h-screen md:items-start md:p-8">
      <div className="min-w-0 max-w-full break-all font-mono text-base leading-7 md:text-lg md:leading-8">
        {lines.map((line, index) => (
          <BootRenderer
            key={line.id}
            line={line}
            onComplete={
              index === lines.length - 1
                ? onLineComplete
                : undefined
            }
          />
        ))}
        <Cursor />
      </div>
    </div>
  );
} 

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
    <div className="flex h-dvh w-full overflow-x-hidden bg-black p-4 md:h-screen md:p-8">
      <div className="min-w-0 max-w-full break-all font-mono text-sm leading-7 md:text-lg md:leading-8">
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

import { BootLine as BootLineView } from "../../boot/components/BootLine";
import type { BootLine as BootLineType } from "../../boot/types/boot";

interface Props {
  lines: BootLineType[];
  onLineComplete: () => void;
}

export function AuthenticationScreen({
  lines,
  onLineComplete,
}: Props) {
  return (
    <div className="flex h-dvh items-center justify-center overflow-x-hidden bg-black px-4 md:h-screen">
      <div className="min-w-0 max-w-full space-y-4 font-mono text-lg text-green-400 md:text-2xl">

        {lines.map((line, index) => (
          <BootLineView
            key={line.id}
            line={line}
            onComplete={
              index === lines.length - 1
                ? onLineComplete
                : undefined
            }
          />
        ))}

      </div>
    </div>
  );
}

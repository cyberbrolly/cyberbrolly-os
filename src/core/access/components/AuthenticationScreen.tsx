import { BootLine } from "../../boot/components/BootLine";
import type { BootLine } from "../../boot/types/boot";

interface Props {
  lines: BootLine[];
  onLineComplete: () => void;
}

export function AuthenticationScreen({
  lines,
  onLineComplete,
}: Props) {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="font-mono text-2xl text-green-400 space-y-4">

        {lines.map((line, index) => (
          <BootLine
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
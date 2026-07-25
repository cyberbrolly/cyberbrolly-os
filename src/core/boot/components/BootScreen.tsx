import { Cursor } from "./Cursor";
import { BootLine } from "./BootLine";
import type { BootLine as BootLineType } from "../types/boot";

interface Props {
  lines: BootLineType[];
}

export function BootScreen({ lines }: Props) {
  return (
    <div className="flex h-screen w-screen bg-black p-8">
      <div className="font-mono text-lg leading-8">
        {lines.map((line) => (
          <BootLine
            key={line.id}
            line={line}
          />
        ))}

        <Cursor />
      </div>
    </div>
  );
}
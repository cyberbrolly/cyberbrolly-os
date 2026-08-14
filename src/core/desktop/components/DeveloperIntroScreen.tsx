'use client';

import { useEffect, useState } from "react";

import { useSound } from "../../shared/hooks/useSound";

interface Props {
  onComplete: () => void;
}

const lines = [
  "Initializing developer profile...",
  "Loading projects...",
  "Loading skills...",
  "Verifying identity...",
  "Welcome to DevOS.",
];

export function DeveloperIntroScreen({
  onComplete,
}: Props) {
  const [visible, setVisible] = useState(0);
  const { play } = useSound();

  useEffect(() => {
    if (visible >= lines.length) {
      const timeout = setTimeout(onComplete, 800);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      // Fired here rather than on `visible` changing so the blip lands on the
      // same frame as the line it belongs to.
      play("blip", 0.3);
      setVisible((v) => v + 1);
    }, 600);

    return () => clearTimeout(timeout);
  }, [visible, onComplete, play]);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="w-[700px] font-mono text-green-400">
        <h1 className="mb-8 text-3xl">
          Developer Profile
        </h1>

        {lines.slice(0, visible).map((line) => (
          <div
            key={line}
            className="mb-3"
          >
            &gt; {line}
          </div>
        ))}

        {visible < lines.length && (
          <div className="mt-8 h-2 overflow-hidden rounded bg-green-900">
            <div
              className="h-full bg-green-400 transition-all duration-500"
              style={{
                width: `${(visible / lines.length) * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
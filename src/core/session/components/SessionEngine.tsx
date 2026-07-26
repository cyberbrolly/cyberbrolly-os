'use client';

import { useEffect } from 'react';

interface Props {
  onComplete: () => void;
}

export function SessionEngine({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 900);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="w-[700px] font-mono text-green-400">

        <p className="mb-8 text-2xl">
          INITIALIZING USER SESSION...
        </p>

        <div className="mb-6 h-4 w-full overflow-hidden rounded border border-green-500">
          <div className="h-full w-full bg-green-500" />
        </div>

        <p>Loading Developer Profile...</p>

        <p className="mt-4 text-green-500">
          Done.
        </p>

      </div>
    </div>
  );
}
'use client';

import { KernelController } from './KernelController';

interface Props {
  onComplete: () => void;
}

export function KernelEngine({
  onComplete,
}: Props) {
  return (
    <KernelController
      onComplete={onComplete}
    />
  );
}
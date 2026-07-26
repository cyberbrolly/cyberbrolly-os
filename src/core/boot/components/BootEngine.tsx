'use client';

import { BootController } from './BootController';

interface Props {
  onComplete: () => void;
}

export function BootEngine({ onComplete }: Props) {
  return (
    <BootController onComplete={onComplete} />
  );
}
'use client';

import { useState } from 'react';

import { BootScreen } from '../../boot/components/BootScreen';
import { kernelSequence } from '../data/kernelSequence';

interface Props {
  onComplete: () => void;
}

export function KernelController({
  onComplete,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleLines = kernelSequence.slice(
    0,
    currentIndex + 1
  );

  const handleLineComplete = () => {
    if (currentIndex < kernelSequence.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    onComplete();
  };

  return (
    <BootScreen
      lines={visibleLines}
      onLineComplete={handleLineComplete}
    />
  );
}
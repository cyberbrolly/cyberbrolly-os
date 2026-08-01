'use client';

import { useState } from 'react';

import { bootSequence } from '../data/bootSequence';
import { BootScreen } from './BootScreen';

interface Props {
  onComplete: () => void;
}

export function BootController({ onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleLines = bootSequence.slice(0, currentIndex + 1);
  const handleLineComplete = () => {
    if (currentIndex < bootSequence.length - 1) {
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

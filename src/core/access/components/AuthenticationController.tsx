'use client';

import { useState } from 'react';

import { authenticationSequence } from '../data/authenticationSequence';
import { AuthenticationScreen } from './AuthenticationScreen';

interface Props {
  onComplete: () => void;
}

export function AuthenticationController({
  onComplete,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleLines = authenticationSequence.slice(
    0,
    currentIndex + 1
  );

  const handleComplete = () => {
    if (currentIndex < authenticationSequence.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <AuthenticationScreen
      lines={visibleLines}
      onLineComplete={handleComplete}
    />
  );
}
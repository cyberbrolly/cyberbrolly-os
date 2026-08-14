'use client';

import { useEffect, useState } from 'react';
import { useSound } from '../../shared/hooks/useSound';

import { authenticationSequence } from '../data/authenticationSequence';
import { AuthenticationScreen } from './AuthenticationScreen';

interface Props {
  onComplete: () => void;
}

export function AuthenticationController({
  onComplete,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { play } = useSound();

  const visibleLines = authenticationSequence.slice(
    0,
    currentIndex + 1
  );

  useEffect(() => {
    if (currentIndex === authenticationSequence.length - 1) {
      play('access', 0.4);
    }
  }, [currentIndex, play]);

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
'use client';

import { useEffect, useState } from 'react';

import { QuestionScreen } from './QuestionScreen';

interface Props {
  onComplete: (answer: 'yes' | 'skip') => void;
}

export function QuestionEngine({ onComplete }: Props) {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setSelected(0);
      }

      if (event.key === 'ArrowDown') {
        setSelected(1);
      }

      if (event.key === 'Enter') {
        onComplete(selected === 0 ? 'yes' : 'skip');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected, onComplete]);

  return (
    <QuestionScreen
      selected={selected}
      onSelect={setSelected}
      onComplete={onComplete}
    />
  );
}

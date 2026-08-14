'use client';

import { useCallback, useEffect, useState } from 'react';

import { useSound } from '../../shared/hooks/useSound';
import { QuestionScreen } from './QuestionScreen';

interface Props {
  onComplete: (answer: 'yes' | 'skip') => void;
}

export function QuestionEngine({ onComplete }: Props) {
  const [selected, setSelected] = useState(0);
  const { play } = useSound();

  // Both the keyboard and the pointer path route through these, so moving the
  // caret sounds the same however you did it — and re-picking the option that
  // is already highlighted stays silent.
  const select = useCallback(
    (index: number) => {
      if (index !== selected) {
        play('blip', 0.25);
      }

      setSelected(index);
    },
    [selected, play],
  );

  const confirm = useCallback(
    (answer: 'yes' | 'skip') => {
      play('notify', 0.3);
      onComplete(answer);
    },
    [onComplete, play],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        select(0);
      }

      if (event.key === 'ArrowDown') {
        select(1);
      }

      if (event.key === 'Enter') {
        confirm(selected === 0 ? 'yes' : 'skip');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected, select, confirm]);

  return (
    <QuestionScreen
      selected={selected}
      onSelect={select}
      onComplete={confirm}
    />
  );
}

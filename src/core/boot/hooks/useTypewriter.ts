'use client';

import { useEffect, useRef, useState } from 'react';

export function useTypewriter(
  text: string,
  speed = 20,
  onComplete?: () => void
) {
  const [displayed, setDisplayed] = useState('');
  const finished = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Don't replay the animation once it's finished.
    if (finished.current) return;

    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        finished.current = true;
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

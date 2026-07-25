'use client';

import { useEffect, useState } from 'react';

import { bootSequence } from '../data/bootSequence';
import { BootScreen } from './BootScreen';
import type { BootLine } from '../types/boot';

export function BootEngine() {
  const [lines, setLines] = useState<BootLine[]>([]);

  useEffect(() => {
    let totalDelay = 0;

    bootSequence.forEach((line) => {
      totalDelay += line.delay;

      setTimeout(() => {
        setLines((previous) => [...previous, line]);
      }, totalDelay);
    });
  }, []);

  return <BootScreen lines={lines} />;
}
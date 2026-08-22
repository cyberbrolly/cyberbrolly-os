'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { unlockAudio } from '../../shared/hooks/useSound';
import { useIsMobile } from '../../shared/hooks/useIsMobile';

interface Props {
  onComplete: () => void;
}

/**
 * Gate in front of the boot sequence, present for one reason: browsers keep an
 * AudioContext suspended until the page has been interacted with, and every
 * phase from `boot` through `access` runs on timers alone. Without a gesture
 * here the whole opening act plays silently.
 *
 * It earns its place by reading as hardware — a machine that is off until you
 * switch it on — rather than as a consent dialog.
 */
export function PowerOnEngine({ onComplete }: Props) {
  const [poweringOn, setPoweringOn] = useState(false);
  const isMobile = useIsMobile();

  /**
   * A keypress on the focused button raises both `click` and `keydown`, so the
   * handlers are latched rather than left to fire twice.
   */
  const firedRef = useRef(false);

  const powerOn = useCallback(() => {
    if (firedRef.current) return;

    firedRef.current = true;
    setPoweringOn(true);

    // Awaited so `boot` mounts into a running context. A refused unlock still
    // continues — a silent OS beats one stuck on its title screen.
    void unlockAudio().finally(onComplete);
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Browser shortcuts and focus traversal are not "any key".
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'Tab') return;

      powerOn();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [powerOn]);

  return (
    <button
      type="button"
      autoFocus
      onClick={powerOn}
      onTouchStart={powerOn}
      aria-label="Power on CyberBrolly DevOS"
      className="flex h-dvh w-full cursor-pointer items-center justify-center overflow-x-hidden bg-black px-4 md:h-screen"
    >
      <div className="font-mono text-green-400">

        <div className="mb-10 border-2 border-green-400 px-10 py-6">
          <h1 className="neon-text text-5xl font-bold tracking-[0.2em] md:text-5xl md:tracking-[0.3em]">
            DEVOS
          </h1>
        </div>

        <p
          className={`text-center text-xl leading-8 tracking-[0.2em] md:text-lg md:leading-normal ${
            poweringOn ? '' : 'animate-pulse'
          }`}
        >
          {poweringOn
            ? 'POWERING ON...'
            : isMobile
              ? 'TAP TO POWER ON'
              : 'PRESS ANY KEY TO POWER ON'}
        </p>

      </div>
    </button>
  );
}

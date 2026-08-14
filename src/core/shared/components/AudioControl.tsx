'use client';

import { Volume1, Volume2, VolumeX } from 'lucide-react';

import {
  setMasterVolume,
  toggleMuted,
  useAudioSettings,
} from '../hooks/useSound';

interface Props {
  compact?: boolean;
}

export function AudioControl({ compact = false }: Props) {
  const { muted, volume } = useAudioSettings();
  const audibleVolume = muted ? 0 : volume;
  const VolumeIcon =
    audibleVolume === 0 ? VolumeX : audibleVolume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      className={`flex items-center gap-2 border border-green-500/20 bg-black/70 font-mono text-green-400 backdrop-blur-md ${
        compact ? 'px-2 py-1' : 'px-3 py-2'
      }`}
      role="group"
      aria-label="System audio controls"
    >
      <button
        type="button"
        onClick={toggleMuted}
        aria-label={muted ? 'Unmute system audio' : 'Mute system audio'}
        aria-pressed={muted}
        title={muted ? 'Unmute system audio' : 'Mute system audio'}
        className="text-green-500/70 transition hover:text-green-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-green-400"
      >
        <VolumeIcon size={compact ? 15 : 16} aria-hidden="true" />
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={audibleVolume}
        onChange={(event) => setMasterVolume(Number(event.target.value))}
        aria-label="System audio volume"
        className={`h-1 cursor-pointer accent-green-500 ${compact ? 'w-16' : 'w-20'}`}
      />

      {!compact && (
        <span
          className="w-7 text-[10px] tabular-nums text-green-500/50"
          aria-hidden="true"
        >
          {Math.round(audibleVolume * 100)}
        </span>
      )}
    </div>
  );
}

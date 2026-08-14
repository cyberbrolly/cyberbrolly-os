'use client';

import { useSound } from '../../shared/hooks/useSound';

interface Props {
  icon: string;
  label: string;
  onClick?: () => void;
}

export function DesktopIcon({
  icon,
  label,
  onClick,
}: Props) {
  const { play } = useSound();

  const handleClick = () => {
    play('blip', 0.3);
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onPointerEnter={() => play('blip', 0.08)}
      className="flex w-24 cursor-pointer flex-col items-center gap-2 rounded p-3 text-left transition hover:bg-green-500/10"
    >
      <div className="text-5xl">
        {icon}
      </div>

      <span className="font-mono text-sm text-green-400">
        {label}
      </span>
    </button>
  );
}

"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";

import { useSound, type SoundType } from "../../shared/hooks/useSound";

interface Props {
  title: string;
  children: ReactNode;
  onClose: () => void;
  index: number;
  zIndex: number;
  onFocus: () => void;
  /** Overridden by apps that deserve a more noticeable cue than window chrome. */
  openSound?: SoundType;
}

export function Window({
  title,
  children,
  onClose,
  index,
  zIndex,
  onFocus,
  openSound = "windowOpen",
}: Props) {
  const { play } = useSound();

  // Mount rather than the click handler, so windows restored from
  // `initialWindow` are announced too.
  useEffect(() => {
    play(openSound, 0.3);
  }, [play, openSound]);

  const handleClose = () => {
    play("windowClose", 0.3);
    onClose();
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onMouseDown={onFocus}
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      className="absolute flex h-[560px] w-[700px] flex-col rounded-lg border border-green-500/30 bg-[#0f1419] shadow-2xl"
      style={{
        left: 180 + index * 40,
        top: 80 + index * 30,
        zIndex,
      }}
    >
      <div className="flex items-center justify-between border-b border-green-500/20 px-4 py-2">
        <span className="font-mono text-green-400">{title}</span>

        <button
          type="button"
          onClick={handleClose}
          className="font-mono text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">{children}</div>
      </div>
    </motion.div>
  );
}

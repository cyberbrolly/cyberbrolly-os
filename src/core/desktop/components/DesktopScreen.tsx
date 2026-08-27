"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import { desktopIcons } from "../data/desktopIcons";
import { AppContent } from "../apps/AppContent";
import { DesktopIcon } from "./DesktopIcon";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";
import { Wallpaper } from "./Wallpaper";
import type { SoundType } from "../../shared/hooks/useSound";
import type { OpenWindow } from "./DesktopEngine";

/** Apps that deserve a softer notification cue instead of plain window chrome. */
const WINDOW_SOUNDS: Partial<Record<string, SoundType>> = {
  resume: "notify",
  contact: "notify",
};

function getWindowLabel(appId: string): string {
  return desktopIcons.find((icon) => icon.app === appId)?.label ?? appId;
}

interface Props {
  openWindows: OpenWindow[];
  onOpenApp: (appId: string) => void;
  onFocusWindow: (appId: string) => void;
  onCloseWindow: (appId: string) => void;
}

export function DesktopScreen({
  openWindows,
  onOpenApp,
  onFocusWindow,
  onCloseWindow,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 overflow-hidden bg-[#0b0f14]"
    >
      <Wallpaper />

      <div className="absolute inset-0 bg-black/40" />

      <div
        ref={containerRef}
        className="relative z-10 hidden h-full flex-col md:flex"
      >
        {/* Desktop */}
        <div className="grid grid-cols-1 gap-6 p-6">
          {desktopIcons.map((icon) => (
            <DesktopIcon
              key={icon.id}
              icon={icon.icon}
              label={icon.label}
              onClick={() => onOpenApp(icon.app)}
            />
          ))}
        </div>

        {/* Window */}
        {openWindows.map((window) => (
          <Window
            key={window.id}
            title={getWindowLabel(window.id)}
            x={window.x}
            y={window.y}
            zIndex={window.z}
            containerRef={containerRef}
            openSound={WINDOW_SOUNDS[window.id] ?? "windowOpen"}
            onFocus={() => onFocusWindow(window.id)}
            onClose={() => onCloseWindow(window.id)}
          >
            <AppContent appId={window.id} />
          </Window>
        ))}

        <Taskbar />
      </div>
    </motion.div>
  );
}

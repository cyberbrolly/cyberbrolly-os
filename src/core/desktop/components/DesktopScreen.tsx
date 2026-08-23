"use client";

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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 overflow-hidden bg-[#0b0f14]"
    >
      <Wallpaper />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center font-mono text-green-400 md:hidden">
        <h1 className="text-2xl font-bold">DevOS is designed for desktop.</h1>
        <p className="mt-4 max-w-md text-green-300">
          For the best experience, please visit on a laptop or desktop computer.
        </p>
        <p className="mt-2 text-green-500">Mobile view coming soon.</p>
      </div>

      <div className="relative z-10 hidden h-full flex-col md:flex">
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
        {openWindows.map((window, index) => (
          <Window
            key={window.id}
            title={window.id}
            index={index}
            zIndex={window.z}
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

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { desktopIcons } from "../data/desktopIcons";
import { DesktopIcon } from "./DesktopIcon";
import { Window } from "./Window";
import { Taskbar } from "./Taskbar";

import { AboutApp } from ".././apps/about/AboutApp";
import { TerminalApp } from ".././apps/terminal/TerminalApp";
import { Wallpaper } from "./Wallpaper";
import { ProjectsApp } from "../apps/projects/components/ProjectsApp";
import { ResumeApp } from "../apps/resume/components/ResumeApp";
import { ContactApp } from "../apps/contact/ContactApp";
import { useSound, type SoundType } from "../../shared/hooks/useSound";

/** Apps that deserve a softer notification cue instead of plain window chrome. */
const WINDOW_SOUNDS: Partial<Record<string, SoundType>> = {
  resume: "notify",
  contact: "notify",
};

interface Props {
  initialWindow?: string | null;
}

export function DesktopScreen({
  initialWindow = null,
}: Props) {
  const [openWindows, setOpenWindows] = useState<
    { id: string; z: number }[]
  >(() => (initialWindow ? [{ id: initialWindow, z: 999 }] : []));
  const [topZ, setTopZ] = useState(initialWindow ? 1000 : 1);
  const { play } = useSound();

  useEffect(() => {
    play("login", 0.3);
  }, [play]);

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
              onClick={() => {
                setOpenWindows((prev) => {
                  if (prev.some((w) => w.id === icon.app)) {
                    return prev;
                  }

                  return [
                    ...prev,
                    {
                      id: icon.app,
                      z: topZ,
                    },
                  ];
                });

                setTopZ((z) => z + 1);
              }}
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
            onFocus={() => {
              setOpenWindows((prev) =>
                prev.map((w) =>
                  w.id === window.id
                    ? { ...w, z: topZ }
                    : w,
                ),
              );

              setTopZ((z) => z + 1);
            }}
            onClose={() =>
              setOpenWindows((prev) => prev.filter((w) => w.id !== window.id))
            }
          >
            {window.id === "about" ? (
              <AboutApp />
            ) : window.id === "terminal" ? (
              <TerminalApp />
            ) : window.id === "projects" ? (
              <ProjectsApp />
            ) : window.id === "resume" ? (
              <ResumeApp />
            ) : window.id === "contact" ? (
              <ContactApp />
            ) : (
              <div className="font-mono text-green-400">
                {window.id} application
              </div>
            )}
          </Window>
        ))}

        <Taskbar />
      </div>
    </motion.div>
  );
}

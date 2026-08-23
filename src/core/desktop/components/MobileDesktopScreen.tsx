'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

import { desktopIcons } from '../data/desktopIcons';
import { AppContent } from '../apps/AppContent';
import { useSound, type SoundType } from '../../shared/hooks/useSound';
import { Clock } from './Clock';
import { Wallpaper } from './Wallpaper';
import type { OpenWindow } from './DesktopEngine';

const descriptions: Record<string, string> = {
  about: 'Profile, skills, and focus.',
  projects: 'Selected work and experiments.',
  terminal: 'Explore the DevOS command line.',
  resume: 'Experience, skills, and credentials.',
  contact: 'Ways to get in touch.',
};

const appSounds: Partial<Record<string, SoundType>> = { resume: 'notify', contact: 'notify' };

interface Props {
  openWindows: OpenWindow[];
  activeWindow: OpenWindow | null;
  onOpenApp: (appId: string) => void;
  onCloseWindow: (appId: string) => void;
}

export function MobileDesktopScreen({
  openWindows,
  activeWindow,
  onOpenApp,
  onCloseWindow,
}: Props) {
  const { play } = useSound();
  const activeAppId = activeWindow?.id ?? null;

  useEffect(() => {
    if (activeAppId) {
      play(appSounds[activeAppId] ?? 'windowOpen', 0.3);
    }
  }, [activeAppId, play]);

  const openApp = (app: string) => {
    onOpenApp(app);
  };

  const closeApp = () => {
    play('windowClose', 0.3);
    if (activeWindow) onCloseWindow(activeWindow.id);
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex min-w-0 flex-col overflow-hidden bg-[#0b0f14] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] font-mono text-green-400">
      <Wallpaper />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {activeWindow ? (
          <>
            <header className="flex h-12 shrink-0 items-center border-b border-green-500/20 bg-black/50 pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] backdrop-blur-xl">
              <button type="button" onClick={closeApp} className="text-sm text-green-300">← Home</button>
              <span className="mx-auto text-sm uppercase tracking-widest">{activeWindow.id}</span>
            </header>
            <section className="min-h-0 min-w-0 flex-1 overflow-y-auto pt-5 pr-[max(1.25rem,env(safe-area-inset-right))] pb-16 pl-[max(1.25rem,env(safe-area-inset-left))] [&_input]:min-w-0">
              <AppContent appId={activeWindow.id} />
            </section>
          </>
        ) : (
          <section className="min-h-0 min-w-0 flex-1 overflow-y-auto pt-4 pr-[max(1rem,env(safe-area-inset-right))] pb-16 pl-[max(1rem,env(safe-area-inset-left))]">
            <div className="mb-6 pt-5"><p className="text-xs uppercase tracking-[0.3em] text-green-500/70">DevOS</p><h1 className="mt-2 text-2xl font-bold">Applications</h1></div>
            <div className="space-y-3">
              {desktopIcons.map((icon) => (
                <button key={icon.id} type="button" onClick={() => openApp(icon.app)} className="flex w-full items-center gap-4 border border-green-500/25 bg-black/30 p-4 text-left transition active:bg-green-500/10">
                  <span className="text-3xl" aria-hidden="true">{icon.icon}</span>
                  <span><strong className="block text-lg text-green-300">{icon.label}</strong><span className="text-sm text-green-500/80">{descriptions[icon.app]}</span></span>
                </button>
              ))}
            </div>
          </section>
        )}
        <nav className="fixed right-0 bottom-0 left-0 z-20 flex min-h-11 items-center justify-between border-t border-green-500/20 bg-black/60 pr-[max(1rem,env(safe-area-inset-right))] pb-[env(safe-area-inset-bottom)] pl-[max(1rem,env(safe-area-inset-left))] backdrop-blur-xl">
          <button type="button" onClick={activeWindow ? closeApp : undefined} className="text-sm text-green-300">{activeWindow ? '← Back' : '⌂ Home'}</button>
          <span className="text-xs text-green-500/70">{openWindows.length} open</span>
          <Clock />
        </nav>
      </div>
    </motion.main>
  );
}

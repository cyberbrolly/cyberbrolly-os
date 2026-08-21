'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { desktopIcons } from '../data/desktopIcons';
import { AboutApp } from '../apps/about/AboutApp';
import { ContactApp } from '../apps/contact/ContactApp';
import { ProjectsApp } from '../apps/projects/components/ProjectsApp';
import { ResumeApp } from '../apps/resume/components/ResumeApp';
import { TerminalApp } from '../apps/terminal/TerminalApp';
import { useSound, type SoundType } from '../../shared/hooks/useSound';
import { Clock } from './Clock';

const descriptions: Record<string, string> = {
  about: 'Profile, skills, and focus.',
  projects: 'Selected work and experiments.',
  terminal: 'Explore the DevOS command line.',
  resume: 'Experience, skills, and credentials.',
  contact: 'Ways to get in touch.',
};

const appComponents: Record<string, React.ComponentType> = {
  about: AboutApp,
  projects: ProjectsApp,
  terminal: TerminalApp,
  resume: ResumeApp,
  contact: ContactApp,
};

const appSounds: Partial<Record<string, SoundType>> = { resume: 'notify', contact: 'notify' };

export function MobileDesktopScreen({ initialWindow = null }: { initialWindow?: string | null }) {
  const [activeApp, setActiveApp] = useState<string | null>(initialWindow);
  const { play } = useSound();

  useEffect(() => {
    play('login', 0.3);
    if (initialWindow) play(appSounds[initialWindow] ?? 'windowOpen', 0.3);
  }, [initialWindow, play]);

  const openApp = (app: string) => {
    play(appSounds[app] ?? 'windowOpen', 0.3);
    setActiveApp(app);
  };

  const closeApp = () => {
    play('windowClose', 0.3);
    setActiveApp(null);
  };

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 flex flex-col bg-[#0b0f14] font-mono text-green-400">
      {activeApp ? (
        <>
          <header className="flex h-12 shrink-0 items-center border-b border-green-500/20 bg-black/50 px-4 backdrop-blur-xl">
            <button type="button" onClick={closeApp} className="text-sm text-green-300">← Home</button>
            <span className="mx-auto text-sm uppercase tracking-widest">{activeApp}</span>
          </header>
          <section className="min-h-0 flex-1 overflow-y-auto p-5 pb-16">
            {(() => { const App = appComponents[activeApp]; return App ? <App /> : null; })()}
          </section>
        </>
      ) : (
        <section className="min-h-0 flex-1 overflow-y-auto p-4 pb-16">
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
      <nav className="fixed bottom-0 left-0 right-0 flex h-11 items-center justify-between border-t border-green-500/20 bg-black/60 px-4 backdrop-blur-xl">
        <button type="button" onClick={activeApp ? closeApp : undefined} className="text-sm text-green-300">{activeApp ? '← Back' : '⌂ Home'}</button>
        <Clock />
      </nav>
    </motion.main>
  );
}

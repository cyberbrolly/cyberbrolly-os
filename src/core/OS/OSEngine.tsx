'use client';

import { useState } from "react";

import type { SystemPhase } from "../system/phase";
import { AnimatePresence } from "framer-motion";

import { BootEngine } from "../boot/components/BootEngine";
import { KernelEngine } from "../kernel/components/KernelEngine";
import { CountdownEngine } from "../countdown/components/CountdownEngine";
import { AccessGrantedEngine } from "../access/components/AccessGrantedEngine";
import { SessionEngine } from "../session/components/SessionEngine";
import { WelcomeEngine } from "../welcome/components/WelcomeEngine";
import { QuestionEngine } from "../question/components/QuestionEngine";

import { ScreenTransition } from "../shared/components/ScreenTransition";

export function OSEngine() {
  const [phase, setPhase] = useState<SystemPhase>("boot");

  let screen: React.ReactNode = null;

  switch (phase) {
    case "boot":
      screen = (
        <BootEngine
          onComplete={() => setPhase("kernel")}
        />
      );
      break;

    case "kernel":
      screen = (
        <KernelEngine
          onComplete={() => setPhase("countdown")}
        />
      );
      break;

    case "countdown":
      screen = (
        <CountdownEngine
          start={3}
          onComplete={() => setPhase("access")}
        />
      );
      break;

    case "access":
      screen = (
        <AccessGrantedEngine
          onComplete={() => setPhase("session")}
        />
      );
      break;

    case "session":
      screen = (
        <SessionEngine
          onComplete={() => setPhase("welcome")}
        />
      );
      break;

    case "welcome":
      screen = (
        <WelcomeEngine
          onComplete={() => setPhase("question")}
        />
      );
      break;

    case "question":
      screen = (
        <QuestionEngine
          onComplete={(answer) => {
            if (answer === "yes") {
              setPhase("about");
            } else {
              setPhase("desktop");
            }
          }}
        />
      );
      break;

    case "about":
      screen = (
        <div className="flex h-screen items-center justify-center bg-black">
          <h1 className="font-mono text-5xl text-green-400">
            About Module
          </h1>
        </div>
      );
      break;

    case "desktop":
      screen = (
        <div className="flex h-screen items-center justify-center bg-black">
          <h1 className="font-mono text-5xl text-green-400">
            Desktop Module
          </h1>
        </div>
      );
      break;

    default:
      screen = null;
  }

  return (
    <AnimatePresence mode="wait">
      <ScreenTransition key={phase}>
        {screen}
      </ScreenTransition>
    </AnimatePresence>
  );
}

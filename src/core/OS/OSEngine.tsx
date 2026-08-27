'use client';

import { useState } from "react";

import type { SystemPhase } from "../system/phase";
import { AnimatePresence } from "framer-motion";

import { PowerOnEngine } from "../poweron/components/PowerOnEngine";
import { MobileBootSequence } from "../boot/components/MobileBootSequence";
import { BootEngine } from "../boot/components/BootEngine";
import { KernelEngine } from "../kernel/components/KernelEngine";
import { CountdownEngine } from "../countdown/components/CountdownEngine";
import { AccessGrantedEngine } from "../access/components/AccessGrantedEngine";
import { SessionEngine } from "../session/components/SessionEngine";
import { WelcomeEngine } from "../welcome/components/WelcomeEngine";
import { QuestionEngine } from "../question/components/QuestionEngine";
import { DesktopEngine } from "../desktop/components/DesktopEngine";
import { ScreenTransition } from "../shared/components/ScreenTransition";
import { AudioControl } from "../shared/components/AudioControl";
import { ErrorBoundary } from "../shared/components/ErrorBoundary";
import { DeveloperIntroScreen } from "../desktop/components/DeveloperIntroScreen";
import { useIsMobile } from "../shared/hooks/useIsMobile";


export function OSEngine() {
  const [phase, setPhase] = useState<SystemPhase>("poweron");
  const isMobile = useIsMobile();

  // useIsMobile hydrates after mount; read the query at the gesture boundary
  // as well so a very fast first tap cannot enter the desktop boot narrative.
  const completePowerOn = () => {
    const mobileViewport =
      isMobile ||
      (typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767px)").matches);
    setPhase(mobileViewport ? "mobileBoot" : "boot");
  };

  let screen: React.ReactNode = null;

  switch (phase) {
    case "poweron":
      screen = (
        <PowerOnEngine
          onComplete={completePowerOn}
        />
      );
      break;

    case "mobileBoot":
      screen = <MobileBootSequence onComplete={() => setPhase("desktop")} />;
      break;

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
    
      case "desktop":
        screen = (
          <DesktopEngine />
        );
      break;
    
      case "about":
        screen = (
          <DeveloperIntroScreen
            onComplete={() => setPhase("developer")}
          />
        );
        break;
      
      case "developer":
        screen = (
          <DesktopEngine
            initialWindow="about"
          />
        );
        break;

  
    default:
      screen = null;
  }

  return (
    <>
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <ScreenTransition key={phase}>
            {screen}
          </ScreenTransition>
        </AnimatePresence>
      </ErrorBoundary>

      <div className="fixed top-3 right-[max(0.75rem,env(safe-area-inset-right))] z-[100]">
        <AudioControl compact={phase !== "desktop" && phase !== "developer"} />
      </div>
    </>
  );
}

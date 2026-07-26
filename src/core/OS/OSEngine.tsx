'use client';

import { useState } from "react";

import type { SystemPhase } from "../system/phase";
import { WelcomeEngine } from "../welcome/components/WelcomeEngine";
import { BootEngine } from "../boot/components/BootEngine";
import { KernelEngine } from "../kernel/components/KernelEngine";
import { CountdownEngine } from "../countdown/components/CountdownEngine";
import { AccessGrantedEngine } from "../access/components/AccessGrantedEngine";
import { SessionEngine } from "../session/components/SessionEngine";
import { QuestionEngine } from "../question/components/QuestionEngine";

export function OSEngine() {
  const [phase, setPhase] =
    useState<SystemPhase>("boot");

  switch (phase) {
    case "boot":
      return (
        <BootEngine
          onComplete={() => setPhase("kernel")}
        />
      );

    case "kernel":
      return (
        <KernelEngine
          onComplete={() => setPhase("countdown")}
        />
      );

    case "countdown":
      return (
        <CountdownEngine
          start={3}
          onComplete={() => setPhase("access")}
        />
      );

      case "welcome":
        return (
          <WelcomeEngine
            onComplete={() => setPhase("question")}
          />
      );
      case "access":
          return (
            <AccessGrantedEngine
              onComplete={() => setPhase("session")}
            />
      );
      case "session":
            return (
              <SessionEngine
                onComplete={() => setPhase("welcome")}
              />
            );
    

            case "question":
              return (
                <QuestionEngine
                  onComplete={(answer) => {
                    console.log(answer);
                  }}
                />
              );
    default:
      return null;
  }
}
import type { ComponentType } from "react";

import { AboutApp } from "./about/AboutApp";
import { ContactApp } from "./contact/ContactApp";
import { ProjectsApp } from "./projects/components/ProjectsApp";
import { ResumeApp } from "./resume/components/ResumeApp";
import { TerminalApp } from "./terminal/TerminalApp";

const appComponents: Record<string, ComponentType> = {
  about: AboutApp,
  contact: ContactApp,
  projects: ProjectsApp,
  resume: ResumeApp,
  terminal: TerminalApp,
};

export function AppContent({ appId }: { appId: string }) {
  const App = appComponents[appId];

  return App ? (
    <App />
  ) : (
    <div className="font-mono text-green-400">{appId} application</div>
  );
}

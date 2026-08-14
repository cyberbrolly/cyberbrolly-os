'use client';

import { useEffect, useState } from "react";

import { sessionTasks } from "../data/sessionTasks";
import { useSound } from "../../shared/hooks/useSound";
import { ProgressBar } from "./ProgressBar";
import { LoadingTask } from "./LoadingTask";
import { SessionReady } from "./SessionReady";


interface Props {
  onComplete: () => void;
}

export function SessionEngine({ 
  onComplete,
}: Props) {
  const [progress, setProgress] = useState(0);
  const [visibleTasks, setVisibleTasks] = useState(0);
const [activeTask, setActiveTask] = useState(0);
  const { play } = useSound();


    useEffect(() => {
      const totalTasks = sessionTasks.length;
      let progress = 0;
      let completionTimeout: ReturnType<typeof setTimeout> | undefined;

      // Ticks are driven off this rather than `visibleTasks` so a task is
      // announced once, on the tick that completes it — state updates from
      // inside the interval land too late to compare against.
      let lastCompleted = 0;
    
      const interval = setInterval(() => {
        progress++;
    
        setProgress(progress);
    
        const completedTasks = Math.floor(
          (progress / 100) * totalTasks
        );
    
        setVisibleTasks(completedTasks);
        setActiveTask(
          Math.min(completedTasks, totalTasks - 1)
        );

        // The final task completes on the same tick as the bar filling, so its
        // tick is skipped rather than stacked under the completion chime.
        if (completedTasks > lastCompleted && progress < 100) {
          lastCompleted = completedTasks;
          play('blip', 0.16);
        }

        if (progress >= 100) {
          clearInterval(interval);

          play('notify', 0.28);

          completionTimeout = setTimeout(() => {
            onComplete();
          }, 700);
        }
      }, 35);
     
    
      return () => {
        clearInterval(interval);

        if (completionTimeout) {
          clearTimeout(completionTimeout);
        }
      };
    }, [onComplete, play]);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="w-[700px] font-mono text-green-400">

        <h1 className="mb-6 text-4xl">
          INITIALIZING USER SESSION...
        </h1>

        <ProgressBar progress={progress} />

        <div className="mt-8 space-y-2">
          {sessionTasks.map((task, index) => {
            if (index < visibleTasks) {
              return (
                <LoadingTask
                  key={task}
                  text={task}
                />
              );
            }
        
            if (index === activeTask && progress < 100) {
              return (
                <div
                  key={task}
                  className="font-mono text-green-400"
                >
                  &gt; {task}
                </div>
              );
            }
        
            return null;
          })}
        </div>

        {progress === 100 && <SessionReady />}

      </div>
    </div>
  );
}

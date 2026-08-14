'use client';

import { useRef, useState } from "react";
import { useSound } from "../../../shared/hooks/useSound";

import type { TerminalEntry } from "../../types/TerminalEntry";
import { commands } from "./data/command";



export function TerminalApp() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { play } = useSound();

  const commandHistory = history
    .filter((entry) => entry.type === "command")
    .map((entry) =>
      entry.text.replace("cyberbrolly@devos:~$ ", "")
    );

  const handleCommand = () => {
    const command = input.trim().toLowerCase();

    if (!command) return;

    play('type', 0.15);

    // Clear command
    if (command === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const newHistory: TerminalEntry[] = [
      {
        type: "command",
        text: `cyberbrolly@devos:~$ ${command}`,
      },
    ];

    if (commands[command]) {
      play('beep', 0.2);
      commands[command].forEach((line) => {
        newHistory.push({
          type: "output",
          text: line,
        });
      });
    } else {
      play('error', 0.2);
      newHistory.push({
        type: "output",
        text: `Command not found: ${command}`,
      });
    }

    setHistory((prev) => [...prev, ...newHistory]);
    setInput("");
  };
  
  return (
    <div
      className="flex h-full flex-col font-mono text-green-400"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-4 text-xl flex-shrink-0">
        DevOS Terminal v1.0
      </div>
  
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {history.map((entry, index) => (
            <div
              key={index}
              className={
                entry.type === "command"
                  ? "text-green-400"
                  : "ml-6 text-green-300"
              }
            >
              {entry.text}
            </div>
          ))}
        </div>
      </div>
  
      <div className="mt-4 flex items-center gap-2">
        <span>cyberbrolly@devos:~$</span>
  
        
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCommand();
                setHistoryIndex(-1);
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();

                const nextIndex = Math.min(
                  historyIndex + 1,
                  commandHistory.length - 1
                );

                if (commandHistory.length > 0) {
                  setHistoryIndex(nextIndex);

                  setInput(
                    commandHistory[
                      commandHistory.length - 1 - nextIndex
                    ]
                  );
                }
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();

                if (historyIndex <= 0) {
                  setHistoryIndex(-1);
                  setInput("");
                  return;
                }

                const nextIndex = historyIndex - 1;

                setHistoryIndex(nextIndex);

                setInput(
                  commandHistory[
                    commandHistory.length - 1 - nextIndex
                  ]
                );
              }

              if (
                event.key.length === 1 ||
                event.key === "Backspace" ||
                event.key === "Delete"
              ) {
                play("type", 0.13);
              }
            }}
            className="flex-1 bg-transparent text-green-400 caret-green-400 outline-none"          />
          
        </div>
      </div>
    
  );
}

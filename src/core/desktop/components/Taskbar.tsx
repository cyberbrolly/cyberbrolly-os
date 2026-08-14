import { Clock } from "./Clock";

export function Taskbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-10 items-center justify-between border-t border-green-500/20 bg-black/40 px-4 backdrop-blur-xl">
      <div className="font-mono text-green-400">
        DevOS v16
      </div>

      <Clock />
    </div>
  );
}

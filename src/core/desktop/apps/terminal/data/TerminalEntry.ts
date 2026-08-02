export interface TerminalEntry {
  type: "command" | "output";
  text: string;
}
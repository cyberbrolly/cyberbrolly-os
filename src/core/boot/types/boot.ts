export type BootLineType =
  | "text"
  | "status"
  | "progress"
  | "blank";

export interface BootLine {
  id: number;

  type?: BootLineType;

  text?: string;

  label?: string;

  status?: string;

  delay: number;

  typingSpeed?: number;

  color?: "green" | "cyan" | "warning" | "danger";
}
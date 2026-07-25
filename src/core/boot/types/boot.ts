export interface BootLine {
  id: number;
  text: string;
  delayAfter?: number;
  typingSpeed?: number;
  color?: 'green' | 'cyan' | 'warning' | 'danger';
}
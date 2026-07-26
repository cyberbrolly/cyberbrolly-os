import { BootLine } from '../types/boot';

export const bootSequence: BootLine[] = [
  {
    id: 1,
    text: 'CyberBrolly BIOS v1.0',
    delay: 700,
  },
  {
    id: 2,
    text: '',
    delay: 300,
  },
  {
    id: 3,
    text: 'Initializing hardware...',
    delay: 700,
  },
  {
    id: 4,
    type: "status",
    label: "CPU",
    status: "OK",
    delay: 400,
  },
  {
    id: 5,
    type: "status",
    label: "RAM",
    status: "OK",
    delay: 400,
  },
  {
    id: 6,
    type: "status",
    label: "GPU",
    status: "OK",
    delay: 400,
  },
  {
    id: 7,
    text: 'Loading AI Engine.........OK',
    delay: 700,
  },
  {
    id: 8,
    text: 'Decrypting User Profile...',
    delay: 900,
  },
  {
    id: 9,
    text: '',
    delay: 500,
  },
  {
    id: 10,
    text: 'ACCESS GRANTED',
    delay: 1200,
  },
];
import type { Project } from "../types/Projects";

export const projects: Project[] = [
  {
    title: "DevOS",
    description:
      "An interactive operating system portfolio built with Next.js. Features a complete boot sequence, desktop environment, draggable windows, terminal emulator, applications, and immersive OS-inspired animations.",
    image: "/images/projects/devos.png",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
    ],
    github: "#",
    demo: "#",
  },

  {
    title: "EventInbox",
    description:
      "EventInbox is a webhook infrastructure delivery system built to reliably deliver events through configurable endpoints — giving developers a dependable way to route, track, and manage event notifications between services without having to build and maintain that plumbing themselves.",
    image: "/images/projects/eventinbox.png",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "AI",
      "Marketing Automation",
    ],
    github: "#",
    demo: "#",
  },

  {
    title: "Forge",
    description:
      "AI engineering control center rebuilt in Next.js using the Anthropic SDK. Designed as a workspace for managing AI engineering workflows with Claude integration.",
    image: "/images/projects/forge.png",
    stack: [
      "Next.js",
      "TypeScript",
      "Anthropic SDK",
      "React",
    ],
    github: "#",
    demo: "#",
  },

  {
    title: "Sales Voice",
    description:
      "Hackathon project that converts vendor conversations into structured sales and debt records using Google's Gemma 4. Built for the GDG LAUTECH 'Build with Gemma' Hackathon.",
    image: "/images/projects/salesvoice.png",
    stack: [
      "Next.js 14",
      "TypeScript",
      "Node.js",
      "Express",
      "Prisma",
      "SQLite",
      "Gemma 4",
    ],
    github: "#",
    demo: "#",
  },

  {
    title: "NullPaste",
    description:
      "Cyberpunk-inspired team identity platform combining a developer directory with a high-fidelity animated landing page focused on premium UI, branding, and WebGL experiences.",
    image: "/images/projects/nullpaste.png",
    stack: [
      "Next.js 14",
      "TypeScript",
      "Three.js",
      "WebGL",
      "Prisma",
      "PostgreSQL",
    ],
    github: "#",
    demo: "#",
  },

  {
    title: "Threadline",
    description:
      "A minimal collaborative discussion platform powered by recursive thread structures and Zustand state management, designed with a clean, distraction-free interface.",
    image: "/images/projects/threadline.png",
    stack: [
      "Next.js 14",
      "TypeScript",
      "Zustand",
    ],
    github: "#",
    demo: "https://threadline-seven-pink.vercel.app",
  },

  {
    title: "NeuralDash",
    description:
      "Developer profile aggregation platform that evaluates employer compatibility using AI-assisted scoring with live updates powered by WebSockets.",
    image: "/images/projects/neuraldash.png",
    stack: [
      "Flask",
      "Flask-SocketIO",
      "Python",
      "Render",
    ],
    github: "#",
    demo: "#",
  },

  {
    title: "ConsoleChess",
    description:
      "A C++ chess engine with an SDL2 graphical interface featuring minimax AI, alpha-beta pruning, legal move generation, check detection, and click-to-move gameplay.",
    image: "/images/projects/consolechess.png",
    stack: [
      "C++",
      "SDL2",
      "Minimax",
      "Alpha-Beta Pruning",
    ],
    github: "https://github.com/cyberbrolly/ConsoleChess",
    demo: "#",
  },

  {
    title: "Vaultchain",
    description:
      "A blockchain-inspired storage system and one of my earliest flagship engineering projects exploring distributed data concepts and secure storage architecture.",
    image: "/images/projects/vaultchain.png",
    stack: [
      "Blockchain",
      "Storage",
      "Distributed Systems",
    ],
    github: "#",
    demo: "#",
  },
];

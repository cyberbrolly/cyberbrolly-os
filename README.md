# cyberbrolly-os

> A cyberpunk-themed desktop OS simulation, built entirely in the browser.

**[Live Demo →](https://cyberbrolly-os.onrender.com)**

## Overview

`cyberbrolly-os` simulates a full desktop operating system experience in the browser — complete with a boot sequence, a windowed multitasking desktop, and a cyberpunk-inspired visual identity throughout. It's built with the Next.js App Router and driven by a phase-based state machine that takes the "system" from power-on to a fully interactive desktop.

## Features

- 🖥️ **Full boot sequence** — a `PowerOn` phase transitions into the `Desktop` environment, mimicking a real OS startup
- 🪟 **Windowed applications** — draggable, closable app windows with their own state
- 🔊 **Procedural sound synthesis** — UI sounds generated in-browser rather than static audio files
- 📱 **Mobile-optimized experience** — dedicated mobile boot sequence and responsive layout handling
- 🎨 **Consistent cyberpunk aesthetic** — custom favicon, typography, and visual language across every screen
- ⚡ **Phase-driven architecture** — clean separation between boot, power-on, and desktop states

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS *(update if different)*
- **Hosting:** [Render](https://render.com/)
- **CI:** GitHub Actions (lint + test on push/PR)
- **Package management:** pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
git clone https://github.com/cyberbrolly/cyberbrolly-os.git
cd cyberbrolly-os
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
cyberbrolly-os/
├── src/
│   └── core/
│       ├── boot/          # Boot sequence components (incl. mobile)
│       ├── poweron/       # Power-on phase engine
│       ├── question/      # Interactive question/engine components
│       └── shared/        # Shared hooks (sound, mobile detection, etc.)
├── scripts/                # Build/asset scripts (e.g. sound rendering)
├── public/                  # Static assets
└── .github/workflows/       # CI, keep-alive ping, and package publishing
```

## Deployment

The app is deployed on Render's free tier. Since free-tier services spin down after inactivity, an external uptime monitor pings the app every 5 minutes to keep it warm. See `.github/workflows/` for CI configuration.

## Known Issues / In Progress

- Window title/ID mismatch in some multi-window scenarios
- Window position resets on close
- No drag constraints — windows can currently be dragged off-screen
- Minor mobile UI flash from dual mobile-detection code paths

## Contributing

This is currently a solo/personal project, but issues and suggestions are welcome. Open an issue or PR if you spot a bug or have an idea.

## License

MIT 
---

Built by [Cyberbrolly](https://github.com/cyberbrolly)
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

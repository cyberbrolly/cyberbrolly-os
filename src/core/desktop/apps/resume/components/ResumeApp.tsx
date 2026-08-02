'use client';

export function ResumeApp() {
  return (
    <div className="flex h-full flex-col font-mono text-green-400">
      <h1 className="mb-2 text-3xl font-bold">
        📄 CyberBrolly Resume
      </h1>

      <p className="text-green-300">
        Full Stack Developer
      </p>

      <p className="mb-6 text-green-300">
        AI Engineer
      </p>

      <div className="mb-6 border-t border-green-500/20 pt-6 space-y-2">
        <p>✔ 5+ Production Projects</p>
        <p>✔ Next.js • React • TypeScript</p>
        <p>✔ Node.js • Python • AI</p>
        <p>✔ Open to Full-time & Freelance</p>
      </div>

      <div className="mt-auto flex gap-4">
        <a
          href="/resume/cyberbrolly_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded border border-green-500 px-4 py-2 hover:bg-green-500 hover:text-black transition"
        >
          👁 View Resume
        </a>

        <a
          href="/resume/cyberbrolly_CV.pdf"
          download
          className="rounded border border-green-500 px-4 py-2 hover:bg-green-500 hover:text-black transition"
        >
          ⬇ Download Resume
        </a>
      </div>
    </div>
  );
}
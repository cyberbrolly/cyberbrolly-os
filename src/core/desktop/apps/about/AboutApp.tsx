export function AboutApp() {
  return (
    <div className="space-y-6 font-mono text-green-400">

      <div>
        <h1 className="text-3xl font-bold">
          👨‍💻 Cyberbrolly
        </h1>

        <p className="mt-2 text-green-300">
          Full-Stack Developer
        </p>
      </div>

      <p className="leading-7">
        I build modern web applications,
        developer tools and AI-powered
        systems with a focus on performance,
        clean architecture and great user
        experiences.
      </p>

      <div>
        <h2 className="mb-2 text-xl font-bold">
          Skills
        </h2>

        <ul className="space-y-1">
          <li>• React</li>
          <li>• Next.js</li>
          <li>• TypeScript</li>
          <li>• Node.js</li>
          <li>• Tailwind CSS</li>
        </ul>
      </div>

    </div>
  );
}
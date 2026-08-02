const contacts = [
  {
    icon: "✉",
    label: "Email",
    value: "personalmsg40@gmail.com",
    href: "mailto:personalmsg40@gmail.com",
  },
  {
    icon: "🐙",
    label: "GitHub",
    value: "github.com/cyberbrolly",
    href: "https://github.com/cyberbrolly",
  },
  {
    icon: "𝕏",
    label: "X (Twitter)",
    value: "@cyberbrolly",
    href: "https://x.com/cyberbrolly",
  },
  {
    icon: "💬",
    label: "Discord",
    value: "CyberBrolly",
    href: "https://discord.com/app",
  },
  {
    icon: "📱",
    label: "WhatsApp",
    value: "07077146498",
    href: "https://wa.me/2347077146498",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Nigeria",
    href: "https://www.google.com/maps/search/?api=1&query=Nigeria",
  },
];

export function ContactApp() {
  return (
    <div className="space-y-6 font-mono text-green-400">
      <h1 className="text-3xl font-bold">Contact Me</h1>

      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
        <h2 className="font-bold text-green-300">🟢 Available for</h2>
        <ul className="mt-2 space-y-1 text-green-400">
          <li>• Full-time</li>
          <li>• Freelance</li>
          <li>• Open Source</li>
        </ul>
      </div>

      <div className="grid gap-3">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-green-500/30 bg-black/30 p-4 transition hover:border-green-400 hover:bg-green-500/10"
          >
            <span className="block text-sm text-green-500/80">
              {contact.icon} {contact.label}
            </span>
            <span className="mt-1 block text-green-300">{contact.value}</span>
          </a>
        ))}
      </div>

      <footer className="border-t border-green-500/20 pt-4 text-sm text-green-500/80">
        <p>Response time:</p>
        <p>Usually within 24 hours.</p>
      </footer>
    </div>
  );
}

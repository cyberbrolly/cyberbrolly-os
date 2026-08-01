import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberBrolly DevOS",
  description: "Interactive DevOS boot sequence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}
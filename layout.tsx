import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { map, writtenCount } from "@/lib/data";
import { YouCounter } from "@/components/YouCounter";


export const metadata: Metadata = {
  title: "Routes",
  description: "Every money term, one map. Educational only, no affiliate links, not advice.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const total = Object.keys(map.stations).length;
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@500;600&family=Instrument+Sans:wght@400;500;600&display=swap" />
      </head>
      <body>
        <header className="top">
          <Link href="/" className="mark"><span className="ring" /><span className="d word">ROUTES</span></Link>
          <span className="m sub">SYSTEM MAP · {Object.keys(map.lines).length} LINES · {total} STATIONS · {writtenCount()} WRITTEN</span>
          <div className="right m">
            <YouCounter total={total} />
            <Link href="/about" className="pill-y">ABOUT · THE PLEDGE</Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

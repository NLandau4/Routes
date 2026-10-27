import { map } from "@/lib/data";
import Link from "next/link";
import { Subscribe } from "@/components/Subscribe";
export const metadata = { title: "About · Routes" };
export default function About() {
  return (
    <main className="page">
      <h1 className="d">Every money term. One map.</h1>
      <p className="lead">Nobody taught most of us how money works, so we learn by paying for it. Routes is the version where you learn first.</p>
      <p>One term a week, explained the same way every time: what it is, who ends up using it, how it makes money off you, what goes wrong, and what to ask before you touch it. That third field is why this exists. Every financial product has an answer to it, and most money content skips it because the people writing it get paid when you sign up.</p>
      <h2 className="d">The pledge</h2>
      <p><b>{map.pledge}</b> If that ever changes, the first line of this page will say so.</p>
      <h2 className="d">What this is not</h2>
      <p>Advice. Nothing here recommends buying, selling, opening, closing, or switching anything, and nothing is personalized to you. A route is a reading order, not a plan. For decisions about your own situation, talk to a licensed professional who can see the whole picture.</p>
      <h2 className="d">Who writes it</h2>
      <p>Someone who has spent years investing and trading his own money and learning what the fine print means. Not a licensed advisor.</p>
      <h2 className="d">One card a week</h2>
      <p>The map is free and stays free. If you want the next card in your inbox, leave an email. That is the only thing we ask for.</p>
      <Subscribe source="about" />
      <h2 className="d">Your data</h2>
      <p>Which stations you've read is stored in your browser. If you sign in with an email link, it is also saved to your account so it follows you between devices. Routes never asks for balances, account numbers, or holdings. The full version is on the <Link href="/privacy">privacy page</Link>; the rules of the road are in the <Link href="/terms">terms of use</Link>.</p>
      <p className="m" style={{ fontSize: 11, color: "var(--muted)", marginTop: 32 }}>{map.disclaimer.toUpperCase()}</p>
    </main>
  );
}

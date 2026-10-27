import Link from "next/link";
import { map } from "@/lib/data";
export const metadata = { title: "Privacy" };

const UPDATED = "October 26, 2026";

export default function Privacy() {
  return (
    <main className="page">
      <h1 className="d">Privacy</h1>
      <p className="lead">Routes collects almost nothing, and this page says exactly what. Last updated {UPDATED}.</p>
      <p className="m" style={{ fontSize: 11, color: "var(--muted)" }}>DRAFT · WRITTEN IN PLAIN ENGLISH · TO BE REVIEWED BY COUNSEL BEFORE ANY PAID TIER LAUNCHES</p>

      <h2 className="d">What we collect</h2>
      <p><b>If you only read the map:</b> nothing that identifies you. Which stations you have marked as read is stored in your own browser (local storage) and never leaves it unless you sign in.</p>
      <p><b>If you join the email list:</b> your email address and which page you joined from. That is the whole record.</p>
      <p><b>If you sign in:</b> your email address, the list of stations you have marked as read, and the route you have active, so they follow you between devices. Sign-in is by a one-time link sent to your email. We never see or store a password.</p>
      <p><b>What we never ask for:</b> account balances, account numbers, income, holdings, Social Security numbers, or anything about your financial situation. If a page on this site ever asks for those, it is not ours.</p>

      <h2 className="d">What we don't do</h2>
      <p>We don't sell your data. We don't share it with advertisers. We don't run ad networks or tracking pixels. We don't have affiliate relationships, so there is nobody to pass your email to. {map.pledge}</p>

      <h2 className="d">Who processes it</h2>
      <p>Routes runs on a few services that store or move data on our behalf. Each is bound by its own contract to use the data only to provide the service to us.</p>
      <ul>
        <li><b>Supabase</b> hosts the database (emails, read progress, active route) and sends sign-in links.</li>
        <li><b>Vercel</b> hosts the website and keeps standard server logs (IP address, page requested, time) for a short period to run and secure the site.</li>
        <li><b>An email sending service</b> delivers sign-in links and, if you joined the list, the weekly card.</li>
      </ul>
      <p>If we add a payment processor for a paid tier, it will handle card details directly; Routes will not see or store card numbers. This page will be updated first.</p>

      <h2 className="d">Cookies</h2>
      <p>If you sign in, a session cookie keeps you signed in. That is the only cookie we set. We don't use analytics or advertising cookies.</p>

      <h2 className="d">Email</h2>
      <p>If you join the list you get one card a week and the occasional note when a figure on a card changes. Every email has an unsubscribe link, and unsubscribing removes your address from the list.</p>

      <h2 className="d">Your choices</h2>
      <ul>
        <li><b>See your data:</b> everything we hold about you is your email, your read list, and your active route. Email us and we'll send it.</li>
        <li><b>Delete it:</b> email us from the address on the account and we'll delete the account, the read list, and the list subscription within 30 days. Clearing your browser storage removes the local copy.</li>
        <li><b>Leave the list:</b> use the unsubscribe link in any email.</li>
      </ul>
      <p>Residents of California, Colorado, Virginia, and other states with privacy laws have the rights those laws provide. The choices above cover them; nothing we collect is sold or used for targeted advertising.</p>

      <h2 className="d">Children</h2>
      <p>Routes is written for a general audience and is not directed at children under 13. We don't knowingly collect information from anyone under 13. If you believe a child has given us an email address, write to us and we'll remove it.</p>

      <h2 className="d">Security</h2>
      <p>Data is stored with row-level access controls so an account can only read its own rows, and connections are encrypted in transit. No system is perfect; if there is ever a breach affecting your data we will tell you.</p>

      <h2 className="d">Changes</h2>
      <p>If this page changes in a way that matters, the date at the top moves and the email list hears about it before it takes effect.</p>

      <h2 className="d">Contact</h2>
      <p>Questions or requests: <a href="mailto:hello@routesmoney.com">hello@routesmoney.com</a>.</p>

      <p style={{ marginTop: 40 }}><Link href="/terms">Terms of use</Link> · <Link href="/about">About</Link></p>
      <p className="m" style={{ fontSize: 11, color: "var(--muted)", marginTop: 32 }}>{map.disclaimer.toUpperCase()}</p>
    </main>
  );
}

import Link from "next/link";
import { map } from "@/lib/data";
export const metadata = { title: "Terms" };

const UPDATED = "October 26, 2026";

export default function Terms() {
  return (
    <main className="page">
      <h1 className="d">Terms of use</h1>
      <p className="lead">Using Routes means agreeing to these. They are short because the product is simple. Last updated {UPDATED}.</p>
      <p className="m" style={{ fontSize: 11, color: "var(--muted)" }}>DRAFT · WRITTEN IN PLAIN ENGLISH · TO BE REVIEWED BY COUNSEL BEFORE ANY PAID TIER LAUNCHES</p>

      <h2 className="d">1. What Routes is</h2>
      <p>Routes is a publication. It explains money terms and financial products in general terms, the same way for every reader, through a map, decoder cards, articles, videos, and reading orders we call routes. It is educational content, published on a regular schedule, and nothing more.</p>

      <h2 className="d">2. What Routes is not</h2>
      <p><b>{map.disclaimer}</b></p>
      <p>Routes is not a registered investment adviser, broker-dealer, bank, lender, tax preparer, or law firm, and nobody who writes for it is acting as one here. Nothing on this site recommends that you buy, sell, open, close, hold, or switch anything. Nothing is tailored to you; a route is a reading order, not a plan. Reading Routes does not create an adviser-client, fiduciary, or professional relationship of any kind. For decisions about your own situation, consult a licensed professional who can see the whole picture.</p>

      <h2 className="d">3. Accuracy and dates</h2>
      <p>We work hard to get things right. Every figure on a card carries a date and a source, and we re-check them on a schedule. Rates, limits, laws, and fees change, and a figure can be out of date between checks. Content is provided as is, without any warranty that it is accurate, complete, or current, and you agree not to rely on it as the basis for a financial decision without checking the primary source.</p>

      <h2 className="d">4. The pledge</h2>
      <p>{map.pledge} We don't accept payment to feature, rank, or mention any product or company. Companies are named only as examples of a category, with a source for anything said about them. If this ever changes, the About page will say so first.</p>

      <h2 className="d">5. Your account</h2>
      <p>Signing in is optional and uses a one-time email link. You are responsible for the email account you sign in with. We may close an account that abuses the service, attempts to scrape or copy the card store, or uses the site to promote products to other readers. You can delete your account at any time by emailing us; see the <Link href="/privacy">privacy page</Link>.</p>

      <h2 className="d">6. What you can do with the content</h2>
      <p>The map, the cards, the routes, the articles, and the Routes name and marks belong to Routes. You can read them, share links to them, and quote short passages with attribution. You can't republish cards or the map in bulk, sell them, strip the disclaimer from them, or present them as your own or as advice. If you want to license the map for an organization, write to us.</p>

      <h2 className="d">7. Links to other sites</h2>
      <p>Cards cite sources, which are links to other sites (government agencies, regulators, company disclosures). We don't control those sites and aren't responsible for what is on them. A citation is a pointer to where a number came from, not an endorsement.</p>

      <h2 className="d">8. Limitation of liability</h2>
      <p>To the fullest extent the law allows, Routes and the people who make it are not liable for any loss or damage, direct or indirect, arising from your use of the site or reliance on its content, including financial loss, lost profits, or decisions you make after reading. Where liability can't be excluded, it is limited to the amount you paid Routes in the twelve months before the claim, which for the free product is nothing.</p>

      <h2 className="d">9. Paid features</h2>
      <p>Routes is free. If a paid tier launches, its price, what it includes, how to cancel, and the refund policy will be stated at the point of purchase and added here before anyone is charged. Card details will be handled by a payment processor, not by Routes.</p>

      <h2 className="d">10. Changes to these terms</h2>
      <p>If these terms change in a way that matters, the date at the top moves and signed-in readers and the email list are told before the change takes effect. Continuing to use the site after that is agreement to the new terms.</p>

      <h2 className="d">11. Governing law</h2>
      <p>These terms are governed by the laws of the State of California and the United States, without regard to conflict-of-law rules. Disputes will be handled in the state or federal courts located in San Diego County, California, unless the law where you live gives you the right to bring them elsewhere.</p>

      <h2 className="d">12. Contact</h2>
      <p><a href="mailto:hello@routesmoney.com">hello@routesmoney.com</a></p>

      <p style={{ marginTop: 40 }}><Link href="/privacy">Privacy</Link> · <Link href="/about">About</Link></p>
      <p className="m" style={{ fontSize: 11, color: "var(--muted)", marginTop: 32 }}>{map.disclaimer.toUpperCase()}</p>
    </main>
  );
}

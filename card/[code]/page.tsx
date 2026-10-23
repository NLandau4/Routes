import { notFound } from "next/navigation";
import { MapScreen } from "@/components/MapScreen";
import { cards, getCard } from "@/lib/data";

export function generateStaticParams() {
  return Object.values(cards).flatMap((c) => [c.code, ...(c.also || [])].map((code) => ({ code })));
}
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = getCard(code);
  return c ? { title: `${c.code} ${c.title} · Routes`, description: c.summary } : { title: "Routes" };
}
export default async function CardPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = getCard(code);
  if (!c) notFound();
  return <MapScreen initial={c.code} />;
}

import { notFound } from "next/navigation";
import { MapScreen } from "@/components/MapScreen";
import { routes, resolve } from "@/lib/data";

export function generateStaticParams() { return routes.map((r) => ({ slug: r.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = routes.find((x) => x.slug === slug);
  return { title: r ? `${r.title} · a Routes route` : "Routes" };
}
export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = routes.find((x) => x.slug === slug);
  if (!r) notFound();
  return <MapScreen initial={resolve(r.stops[0].code)} initialRoute={r.slug} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameBySlug, getScriptsForGame, getSettings } from "@/lib/data";
import { ScriptCard } from "@/components/site/ScriptCard";
import { Thumb } from "@/components/site/Thumb";
import { plural } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game not found" };
  const settings = await getSettings();
  return {
    title: game.name,
    description: game.description || `${game.name} scripts on ${settings.siteName}.`,
    alternates: { canonical: `/games/${game.slug}` },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();
  const scripts = await getScriptsForGame(game.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Thumb src={game.thumbnail} alt={game.name} className="h-24 w-24 shrink-0 rounded-2xl ring-1 ring-ink/8" />
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{game.name}</h1>
          {game.description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">{game.description}</p>}
          <p className="mt-2 text-sm text-mute">{plural(scripts.length, "script")}</p>
        </div>
      </div>

      {scripts.length === 0 ? (
        <p className="mt-10 text-sm text-mute">No published scripts for this game yet.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scripts.map((s) => (
            <ScriptCard key={s.slug} script={s} />
          ))}
        </div>
      )}
    </div>
  );
}

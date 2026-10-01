import type { Metadata } from "next";
import { getAllGamesWithCounts, getSettings } from "@/lib/data";
import { GameCard } from "@/components/site/GameCard";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: "Games", description: `Every game with scripts on ${settings.siteName}.` };
}

export default async function GamesPage() {
  const games = await getAllGamesWithCounts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Games</h1>
      <p className="mt-2 text-sm text-mute">Browse scripts by game.</p>
      {games.length === 0 ? (
        <p className="mt-10 text-sm text-mute">No games have been added yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {games.map((g) => (
            <GameCard key={g.slug} game={g} />
          ))}
        </div>
      )}
    </div>
  );
}

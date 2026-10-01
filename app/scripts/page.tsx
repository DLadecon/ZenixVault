import type { Metadata } from "next";
import { Suspense } from "react";
import { listPublishedScripts, getAllGamesWithCounts, getCategories, getSettings } from "@/lib/data";
import { ScriptCard } from "@/components/site/ScriptCard";
import { SearchBar } from "@/components/site/SearchBar";
import { Filters } from "@/components/site/Filters";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: "Scripts", description: `Browse every published script on ${settings.siteName}.` };
}

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function ScriptsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const [{ items, total, totalPages }, games, categories] = await Promise.all([
    listPublishedScripts({
      q: sp.q,
      game: sp.game,
      category: sp.category,
      tag: sp.tag,
      sort: (sp.sort as "newest" | "oldest" | "az") ?? "newest",
      page,
    }),
    getAllGamesWithCounts(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">All scripts</h1>
      <p className="mt-2 text-sm text-mute">{total} published script{total === 1 ? "" : "s"}</p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Suspense fallback={<div className="skeleton h-11 flex-1 rounded-xl" />}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={<div className="skeleton h-11 w-64 rounded-xl" />}>
          <Filters games={games} categories={categories} />
        </Suspense>
      </div>

      {items.length === 0 ? (
        <div className="card-surface mt-10 rounded-2xl p-10 text-center">
          <p className="text-sm text-mute">No scripts match those filters yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <ScriptCard key={s.slug} script={s} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams(sp as Record<string, string>);
            params.set("page", String(p));
            return (
              <Link
                key={p}
                href={`/scripts?${params.toString()}`}
                className={`focus-ring rounded-lg px-3.5 py-2 text-sm font-medium ${
                  p === page ? "bg-iris text-white" : "card-surface text-mute hover:text-ink"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

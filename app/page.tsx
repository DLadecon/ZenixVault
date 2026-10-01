import Link from "next/link";
import { ArrowRight, Youtube } from "lucide-react";
import { getSettings, getFeaturedScript, getLatestScripts, getPopularGames } from "@/lib/data";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScriptCard } from "@/components/site/ScriptCard";
import { GameCard } from "@/components/site/GameCard";
import { Thumb } from "@/components/site/Thumb";
import { HeroCode } from "@/components/site/HeroCode";
import { timeAgo } from "@/lib/utils";
import { scriptThumbnail } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, featured, latest, games] = await Promise.all([
    getSettings(),
    getFeaturedScript(),
    getLatestScripts(8),
    getPopularGames(8),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-grid bg-aurora relative overflow-hidden border-b border-ink/8">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="animate-rise">
            <h1 className="text-gradient font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-mute sm:text-lg">{settings.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/scripts" variant="primary">
                Browse scripts <ArrowRight size={16} />
              </LinkButton>
              <LinkButton href={settings.youtubeChannel} variant="secondary">
                <Youtube size={16} /> YouTube channel
              </LinkButton>
            </div>
          </div>
          <div className="animate-rise [animation-delay:150ms]">
            <HeroCode />
          </div>
        </div>
      </section>

      {/* Featured script */}
      {featured && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Featured script</h2>
          <Link
            href={`/scripts/${featured.slug}`}
            className="focus-ring card-surface group mt-6 grid overflow-hidden rounded-3xl border-orchid/25 transition-all hover:border-orchid/50 hover:shadow-lift md:grid-cols-2"
          >
            <Thumb src={scriptThumbnail(featured.thumbnail, featured.youtubeUrl)} alt={featured.title} className="aspect-video w-full md:aspect-auto md:h-full" />
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <Badge tone="accent">Featured</Badge>
                <span className="text-xs text-mute">{featured.game.name}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink group-hover:text-orchid sm:text-3xl">
                {featured.title}
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-mute sm:text-base">{featured.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-mute">
                <span className="font-mono">v{featured.version}</span>
                <span>·</span>
                <span>Updated {timeAgo(featured.updatedAt)}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                <span className="focus-ring inline-flex items-center gap-2 rounded-xl bg-iris px-5 py-2.5 text-sm font-medium text-white shadow-glow">
                  View script <ArrowRight size={15} />
                </span>
                {featured.youtubeUrl && (
                  <span className="focus-ring card-surface inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-ink">
                    <Youtube size={15} /> Watch video
                  </span>
                )}
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Popular games */}
      {games.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-ink">Popular games</h2>
            <Link href="/games" className="focus-ring rounded text-sm font-medium text-azure hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-6 flex gap-5 overflow-x-auto pb-3">
            {games.map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
          </div>
        </section>
      )}

      {/* Latest scripts */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Latest scripts</h2>
          <Link href="/scripts" className="focus-ring rounded text-sm font-medium text-azure hover:underline">
            View all
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="mt-6 text-sm text-mute">No scripts published yet — check back soon.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((s) => (
              <ScriptCard key={s.slug} script={s} />
            ))}
          </div>
        )}
      </section>

      {/* YouTube CTA band */}
      <section className="border-t border-ink/8 bg-panel">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Every script gets a showcase</h2>
            <p className="mt-2 max-w-md text-sm text-mute">
              I post a video walkthrough for every script I publish — see it in action before you copy the code.
            </p>
          </div>
          <LinkButton href={settings.youtubeChannel} variant="primary">
            <Youtube size={16} /> Visit my YouTube
          </LinkButton>
        </div>
      </section>
    </div>
  );
}

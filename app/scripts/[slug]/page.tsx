import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Youtube, ExternalLink } from "lucide-react";
import { getScriptBySlug, incrementScriptViews, getSettings } from "@/lib/data";
import { CodeViewer } from "@/components/site/CodeViewer";
import { YouTubeEmbed } from "@/components/site/YouTubeEmbed";
import { Badge } from "@/components/ui/Badge";
import { Thumb } from "@/components/site/Thumb";
import { getYouTubeId, scriptThumbnail } from "@/lib/youtube";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const script = await getScriptBySlug(slug);
  if (!script || !script.published) return { title: "Script not found" };
  const settings = await getSettings();
  const title = `${script.title} — ${script.game.name}`;
  return {
    title,
    description: script.description || `${script.title} script for ${script.game.name}.`,
    alternates: { canonical: `/scripts/${script.slug}` },
    openGraph: {
      title,
      description: script.description,
      images: script.thumbnail || script.youtubeUrl ? [scriptThumbnail(script.thumbnail, script.youtubeUrl)!] : undefined,
      siteName: settings.siteName,
    },
  };
}

export default async function ScriptPage({ params }: Props) {
  const { slug } = await params;
  const script = await getScriptBySlug(slug);
  if (!script || !script.published) notFound();

  incrementScriptViews(script.id);
  const videoId = getYouTubeId(script.youtubeUrl);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-mute">
        <Link href="/scripts" className="focus-ring rounded hover:text-ink">Scripts</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/games/${script.game.slug}`} className="focus-ring rounded hover:text-ink">{script.game.name}</Link>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {script.featured && <Badge tone="accent">Featured</Badge>}
        <Badge>{script.category}</Badge>
        <span className="font-mono text-xs text-mute">v{script.version}</span>
      </div>

      <h1 className="font-display mt-3 text-3xl font-bold leading-tight text-ink sm:text-4xl">{script.title}</h1>
      <p className="mt-3 text-sm text-mute">
        For <span className="text-ink">{script.game.name}</span> · Updated {formatDate(script.updatedAt)}
      </p>

      {scriptThumbnail(script.thumbnail, script.youtubeUrl) && (
        <Thumb src={scriptThumbnail(script.thumbnail, script.youtubeUrl)} alt={script.title} className="mt-8 aspect-video w-full rounded-2xl" />
      )}

      {script.description && (
        <p className="mt-8 whitespace-pre-line text-base leading-relaxed text-ink/90">{script.description}</p>
      )}

      {script.features.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-ink">Features</h2>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {script.features.map((f) => (
              <li key={f} className="card-surface flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-sm text-ink/90">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-iris" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {script.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {script.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        {script.scriptUrl ? (
          <a
            href={script.scriptUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-iris px-5 py-2.5 text-sm font-medium text-white shadow-glow"
          >
            Get script <ExternalLink size={16} />
          </a>
        ) : null}        {videoId && (
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={
              script.scriptUrl
                ? "focus-ring card-surface inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-ink"
                : "focus-ring inline-flex items-center gap-2 rounded-xl bg-iris px-5 py-2.5 text-sm font-medium text-white shadow-glow"
            }
          >
            <Youtube size={16} /> Watch YouTube video
          </a>
        )}
      </div>
      {script.scriptUrl && (
        <p className="mt-2 text-xs text-mute">
          "Get script" takes you to an external page to grab the code.
        </p>
      )}

      {videoId && (
        <div className="mt-10">
          <h2 className="font-display mb-4 text-lg font-semibold text-ink">Video showcase</h2>
          <YouTubeEmbed videoId={videoId} title={script.title} />
        </div>
      )}

      {!script.scriptUrl && (
        <div className="mt-10">
          <h2 className="font-display mb-4 text-lg font-semibold text-ink">Script</h2>
          <CodeViewer code={script.scriptCode} />
        </div>
      )}

      <Link href={`/games/${script.game.slug}`} className="focus-ring mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-azure hover:underline">
        More {script.game.name} scripts <ArrowRight size={14} />
      </Link>
    </div>
  );
}

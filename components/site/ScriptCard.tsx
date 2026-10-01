import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Thumb } from "./Thumb";
import { Badge } from "@/components/ui/Badge";
import { timeAgo } from "@/lib/utils";
import { scriptThumbnail } from "@/lib/youtube";

export type ScriptCardData = {
  slug: string;
  title: string;
  description: string;
  version: string;
  updatedAt: Date | string;
  thumbnail: string | null;
  youtubeUrl: string | null;
  tags: string[];
  game: { name: string; slug: string };
};

export function ScriptCard({ script }: { script: ScriptCardData }) {
  return (
    <Link
      href={`/scripts/${script.slug}`}
      className="focus-ring card-surface group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:border-iris/40 hover:shadow-glow"
    >
      <Thumb src={scriptThumbnail(script.thumbnail, script.youtubeUrl)} alt={script.title} className="aspect-video w-full" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between text-xs text-mute">
          <span>{script.game.name}</span>
          <span className="font-mono">v{script.version}</span>
        </div>
        <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-iris">
          {script.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-mute">{script.description}</p>
        {script.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {script.tags.slice(0, 3).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-mute">
          <span>Updated {timeAgo(script.updatedAt)}</span>
          <span className="inline-flex items-center gap-1 font-medium text-azure">
            View script <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

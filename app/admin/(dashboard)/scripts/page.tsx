import Link from "next/link";
import { Plus, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteScript, togglePublished, toggleFeatured } from "@/lib/actions";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmButton";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import { Thumb } from "@/components/site/Thumb";
import { Badge } from "@/components/ui/Badge";
import { scriptThumbnail } from "@/lib/youtube";

export default async function AdminScriptsPage() {
  const scripts = await prisma.script.findMany({ orderBy: { createdAt: "desc" }, include: { game: true } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Scripts</h1>
        <Link href="/admin/scripts/new" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-iris px-4 py-2.5 text-sm font-medium text-white shadow-glow">
          <Plus size={15} /> Add script
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {scripts.map((s) => (
          <div key={s.id} className="card-surface flex flex-wrap items-center gap-4 rounded-2xl p-3">
            <Thumb src={scriptThumbnail(s.thumbnail, s.youtubeUrl)} alt={s.title} className="h-14 w-20 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-ink">{s.title}</p>
                {s.featured && <Badge tone="accent">Featured</Badge>}
              </div>
              <p className="text-xs text-mute">{s.game.name} · v{s.version} · {s.views} views</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-mute">
              {s.published ? <Eye size={14} className="text-ok" /> : <EyeOff size={14} />}
              <ToggleSwitch checked={s.published} onToggle={togglePublished.bind(null, s.id)} label={`Publish ${s.title}`} />
            </div>
            <div className="flex items-center gap-2 text-xs text-mute">
              Featured
              <ToggleSwitch checked={s.featured} onToggle={toggleFeatured.bind(null, s.id)} label={`Feature ${s.title}`} />
            </div>

            <Link href={`/admin/scripts/${s.id}`} className="focus-ring rounded-lg px-3 py-1.5 text-xs font-medium text-azure hover:underline">
              Edit
            </Link>
            <ConfirmDeleteButton action={deleteScript.bind(null, s.id)} />
          </div>
        ))}
        {scripts.length === 0 && <p className="text-sm text-mute">No scripts yet.</p>}
      </div>
    </div>
  );
}

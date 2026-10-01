import { prisma } from "@/lib/prisma";
import { deleteVideo } from "@/lib/actions";
import { VideoForm } from "@/components/admin/VideoForm";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmButton";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Videos</h1>
      <p className="mt-1 text-sm text-mute">Tutorial videos shown on the /tutorials page.</p>

      <div className="mt-6">
        <VideoForm />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {videos.map((v) => (
          <div key={v.id} className="card-surface flex items-center gap-4 rounded-2xl p-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-ink">{v.title}</p>
                <Badge>{v.kind === "TUTORIAL" ? "Tutorial" : "Showcase"}</Badge>
              </div>
              <p className="text-xs text-mute">{formatDate(v.publishedAt)}</p>
            </div>
            <ConfirmDeleteButton action={deleteVideo.bind(null, v.id)} />
          </div>
        ))}
        {videos.length === 0 && <p className="text-sm text-mute">No videos yet.</p>}
      </div>
    </div>
  );
}

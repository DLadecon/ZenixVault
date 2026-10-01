import type { Metadata } from "next";
import { getTutorialVideos, getSettings } from "@/lib/data";
import { YouTubeEmbed } from "@/components/site/YouTubeEmbed";
import { getYouTubeId } from "@/lib/youtube";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return { title: "Tutorials", description: `Video tutorials from ${settings.siteName}.` };
}

export default async function TutorialsPage() {
  const videos = await getTutorialVideos();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Tutorials</h1>
      <p className="mt-2 text-sm text-mute">How to use the scripts and get the most out of them.</p>

      {videos.length === 0 ? (
        <p className="mt-10 text-sm text-mute">No tutorials posted yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {videos.map((v) => {
            const id = getYouTubeId(v.youtubeUrl);
            if (!id) return null;
            return (
              <div key={v.id}>
                <YouTubeEmbed videoId={id} title={v.title} />
                <h3 className="font-display mt-3 text-base font-semibold text-ink">{v.title}</h3>
                <p className="mt-1 text-xs text-mute">{formatDate(v.publishedAt)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { youTubeThumbnail } from "@/lib/youtube";

/**
 * Click-to-load embed using youtube-nocookie.com. Nothing from YouTube loads
 * (no iframe, no tracking) until the visitor explicitly presses play.
 */
export function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="focus-ring group relative aspect-video w-full overflow-hidden rounded-2xl bg-black"
      aria-label={`Play video: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={youTubeThumbnail(videoId)} alt="" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
      <span className="absolute inset-0 grid place-items-center bg-void/30">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-iris shadow-glow transition-transform group-hover:scale-110">
          <Play size={26} className="ml-1 fill-white text-white" />
        </span>
      </span>
    </button>
  );
}

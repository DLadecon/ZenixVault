const ID = /^[A-Za-z0-9_-]{11}$/;

/** Extracts an 11-character YouTube video id from any common URL shape. */
export function getYouTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = input.trim();
  if (ID.test(value)) return value;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") {
    id = url.pathname.split("/")[1] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const [, kind, maybeId] = url.pathname.split("/");
      if (["embed", "shorts", "live", "v"].includes(kind)) id = maybeId ?? null;
    }
  }
  return id && ID.test(id) ? id : null;
}

export function youTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Resolves the thumbnail to actually display for a script: a manually
 * uploaded image always wins if present, otherwise falls back to the
 * thumbnail of the script's YouTube video (if it has one).
 */
export function scriptThumbnail(thumbnail: string | null | undefined, youtubeUrl: string | null | undefined): string | null {
  if (thumbnail) return thumbnail;
  const id = getYouTubeId(youtubeUrl);
  return id ? youTubeThumbnail(id) : null;
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

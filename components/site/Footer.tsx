import Link from "next/link";

export function Footer({
  siteName,
  tagline,
  youtubeChannel,
  discordUrl,
}: {
  siteName: string;
  tagline: string;
  youtubeChannel: string;
  discordUrl?: string;
}) {
  return (
    <footer className="border-t border-ink/8">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold text-ink">{siteName}</p>
            <p className="mt-2 text-sm leading-relaxed text-mute">{tagline}</p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <Link href="/" className="focus-ring rounded text-mute hover:text-ink">Home</Link>
            <Link href="/scripts" className="focus-ring rounded text-mute hover:text-ink">Scripts</Link>
            <Link href="/games" className="focus-ring rounded text-mute hover:text-ink">Games</Link>
            <a href={youtubeChannel} target="_blank" rel="noopener noreferrer" className="focus-ring rounded text-mute hover:text-ink">
              YouTube
            </a>
            {discordUrl && (
              <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="focus-ring rounded text-mute hover:text-ink">
                Discord
              </a>
            )}
          </nav>
        </div>
        <p className="mt-10 text-xs text-mute/70">© {new Date().getFullYear()} {siteName}. All scripts are for educational and personal-use showcase purposes.</p>
      </div>
    </footer>
  );
}

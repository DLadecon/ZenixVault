import Link from "next/link";
import { Thumb } from "./Thumb";
import { plural } from "@/lib/utils";

export function GameCard({ game }: { game: { slug: string; name: string; thumbnail: string | null; scriptCount: number } }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="focus-ring group flex w-40 shrink-0 flex-col gap-3 rounded-2xl sm:w-44"
    >
      <Thumb src={game.thumbnail} alt={game.name} className="aspect-square w-full rounded-2xl ring-1 ring-ink/8 transition-all duration-200 group-hover:ring-iris/50" />
      <div>
        <p className="truncate font-display text-sm font-semibold text-ink group-hover:text-iris">{game.name}</p>
        <p className="text-xs text-mute">{plural(game.scriptCount, "script")}</p>
      </div>
    </Link>
  );
}

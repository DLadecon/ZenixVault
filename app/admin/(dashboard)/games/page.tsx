import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteGame } from "@/lib/actions";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmButton";
import { Thumb } from "@/components/site/Thumb";

export default async function AdminGamesPage() {
  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { scripts: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Games</h1>
        <Link href="/admin/games/new" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-iris px-4 py-2.5 text-sm font-medium text-white shadow-glow">
          <Plus size={15} /> Add game
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {games.map((g) => (
          <div key={g.id} className="card-surface flex items-center gap-4 rounded-2xl p-3">
            <Thumb src={g.thumbnail} alt={g.name} className="h-14 w-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{g.name}</p>
              <p className="text-xs text-mute">{g._count.scripts} script(s)</p>
            </div>
            <Link href={`/admin/games/${g.id}`} className="focus-ring rounded-lg px-3 py-1.5 text-xs font-medium text-azure hover:underline">
              Edit
            </Link>
            <ConfirmDeleteButton action={deleteGame.bind(null, g.id)} />
          </div>
        ))}
        {games.length === 0 && <p className="text-sm text-mute">No games yet.</p>}
      </div>
    </div>
  );
}

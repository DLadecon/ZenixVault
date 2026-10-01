import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ScrollText, Gamepad2, Eye, Star } from "lucide-react";

export default async function AdminOverview() {
  const [totalScripts, published, totalGames, totalViewsAgg, featured] = await Promise.all([
    prisma.script.count(),
    prisma.script.count({ where: { published: true } }),
    prisma.game.count(),
    prisma.script.aggregate({ _sum: { views: true } }),
    prisma.script.findFirst({ where: { featured: true }, select: { title: true } }),
  ]);

  const stats = [
    { label: "Published scripts", value: published, icon: ScrollText },
    { label: "Total scripts", value: totalScripts, icon: ScrollText },
    { label: "Games", value: totalGames, icon: Gamepad2 },
    { label: "Total views", value: totalViewsAgg._sum.views ?? 0, icon: Eye },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Overview</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface rounded-2xl p-5">
            <s.icon size={18} className="text-iris" />
            <p className="mt-3 text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-mute">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 card-surface rounded-2xl p-5">
        <p className="text-sm text-mute">Currently featured script</p>
        <p className="mt-1 font-display text-lg font-semibold text-ink">
          {featured ? featured.title : "None selected — pick one from the scripts list."}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/scripts/new" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-iris px-4 py-2.5 text-sm font-medium text-white shadow-glow">
          <ScrollText size={15} /> Add a script
        </Link>
        <Link href="/admin/games/new" className="focus-ring card-surface inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-ink">
          <Gamepad2 size={15} /> Add a game
        </Link>
      </div>
    </div>
  );
}

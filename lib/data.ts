import "server-only";
import { prisma } from "./prisma";
import { cache } from "react";

export const getSettings = cache(async () => {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  if (settings) return settings;
  // Self-heals on first run even before the seed script has been run.
  return prisma.settings.create({ data: { id: 1 } });
});

export async function getFeaturedScript() {
  return prisma.script.findFirst({
    where: { published: true, featured: true },
    orderBy: { updatedAt: "desc" },
    include: { game: true },
  });
}

export async function getLatestScripts(take = 8) {
  return prisma.script.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take,
    include: { game: true },
  });
}

export async function getPopularGames(take = 8) {
  const games = await prisma.game.findMany({
    include: { _count: { select: { scripts: { where: { published: true } } } } },
  });
  return games
    .map((g) => ({ slug: g.slug, name: g.name, thumbnail: g.thumbnail, scriptCount: g._count.scripts }))
    .filter((g) => g.scriptCount > 0)
    .sort((a, b) => b.scriptCount - a.scriptCount)
    .slice(0, take);
}

export async function getAllGamesWithCounts() {
  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { scripts: { where: { published: true } } } } },
  });
  return games.map((g) => ({ ...g, scriptCount: g._count.scripts }));
}

export async function getGameBySlug(slug: string) {
  return prisma.game.findUnique({ where: { slug } });
}

export async function getScriptsForGame(gameId: string) {
  return prisma.script.findMany({
    where: { gameId, published: true },
    orderBy: { createdAt: "desc" },
    include: { game: true },
  });
}

export async function getScriptBySlug(slug: string) {
  return prisma.script.findUnique({ where: { slug }, include: { game: true } });
}

export async function incrementScriptViews(id: string) {
  await prisma.script.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});
}

export type ScriptListParams = {
  q?: string;
  game?: string; // slug
  category?: string;
  tag?: string;
  sort?: "newest" | "oldest" | "az";
  page?: number;
  perPage?: number;
};

export async function listPublishedScripts(params: ScriptListParams) {
  const { q, game, category, tag, sort = "newest", page = 1, perPage = 12 } = params;

  const where: import("@prisma/client").Prisma.ScriptWhereInput = {
    published: true,
    ...(game ? { game: { slug: game } } : {}),
    ...(category ? { category } : {}),
    ...(tag ? { tags: { has: tag } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { tags: { hasSome: q.split(/\s+/).filter(Boolean) } },
            { game: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const orderBy: import("@prisma/client").Prisma.ScriptOrderByWithRelationInput =
    sort === "oldest" ? { createdAt: "asc" } : sort === "az" ? { title: "asc" } : { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.script.findMany({ where, orderBy, include: { game: true }, skip: (page - 1) * perPage, take: perPage }),
    prisma.script.count({ where }),
  ]);

  return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export async function getCategories() {
  const rows = await prisma.script.findMany({
    where: { published: true },
    select: { category: true },
    distinct: ["category"],
  });
  return rows.map((r) => r.category).sort();
}

export async function getTutorialVideos() {
  return prisma.video.findMany({ where: { kind: "TUTORIAL" }, orderBy: { publishedAt: "desc" } });
}

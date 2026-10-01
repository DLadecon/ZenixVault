import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [scripts, games] = await Promise.all([
    prisma.script.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.game.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/scripts`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/games`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/tutorials`, changeFrequency: "weekly", priority: 0.5 },
    ...scripts.map((s) => ({
      url: `${SITE_URL}/scripts/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...games.map((g) => ({
      url: `${SITE_URL}/games/${g.slug}`,
      lastModified: g.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}

import "dotenv/config";
/**
 * Seeds the database with realistic sample data so the site is immediately
 * browsable. Safe to run multiple times (upserts by unique slug/name).
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../lib/slug";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const GAMES = [
  { name: "Blox Fruits", description: "Sail, fight and hunt down Devil Fruits across the Blox Fruits seas." },
  { name: "Fisch", description: "A relaxing (and very grindable) fishing adventure." },
  { name: "Project Slayers 2", description: "Demon-slaying action inspired by anime sword styles and breathing forms." },
  { name: "DOORS", description: "Survive an ever-changing hotel full of entities behind every door." },
  { name: "Pet Simulator 99", description: "Collect pets, open eggs, and climb the leaderboard." },
];

const SCRIPTS: Record<string, Array<{
  title: string; description: string; features: string[]; scriptCode: string;
  version: string; category: string; tags: string[]; published: boolean; featured?: boolean;
  youtubeUrl?: string; scriptUrl?: string;
}>> = {
  "Blox Fruits": [
    {
      title: "Auto Farm & Fruit ESP",
      description: "Farms the current island automatically and highlights nearby Devil Fruit spawns on your screen.",
      features: ["Auto Farm (all islands)", "Fruit ESP with distance", "Auto collect drops", "Anti-AFK"],
      scriptCode: `local Players = game:GetService("Players")\nlocal player = Players.LocalPlayer\n\nlocal Hub = {}\nHub.AutoFarm = true\nHub.FruitESP = true\n\nlocal function farmLoop()\n\twhile Hub.AutoFarm do\n\t\ttask.wait(1)\n\t\t-- sample farm loop for showcase purposes\n\tend\nend\n\ntask.spawn(farmLoop)\nprint("Blox Fruits hub loaded")`,
      version: "3.2",
      category: "Farming",
      tags: ["Auto Farm", "ESP", "Blox Fruits"],
      published: true,
      featured: true,
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      title: "Auto Raid Helper",
      description: "Automates the boss raid rotation and tracks your fragment count between runs.",
      features: ["Auto queue raids", "Fragment tracker", "Auto revive"],
      scriptCode: `-- Auto Raid Helper\nlocal Hub = { AutoRaid = true }\nprint("Raid helper loaded")`,
      version: "1.4",
      category: "Combat",
      tags: ["Raid", "Auto Farm"],
      published: true,
    },
  ],
  Fisch: [
    {
      title: "Auto Fish Pro",
      description: "Casts, waits for the bite, and reels in automatically with perfect-catch timing.",
      features: ["Auto Cast", "Perfect catch timing", "Auto sell", "Rare fish alert"],
      scriptCode: `local Hub = { AutoFish = true }\n\nlocal function fishLoop()\n\twhile Hub.AutoFish do\n\t\ttask.wait(0.5)\n\tend\nend\n\ntask.spawn(fishLoop)\nprint("Fisch auto-fisher loaded")`,
      version: "2.0",
      category: "Farming",
      tags: ["Auto Fish", "Fisch"],
      published: true,
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ],
  "Project Slayers 2": [
    {
      title: "Auto Dungeon Script",
      description: "Automatically farms the new dungeon mode and collects rewards while you're away.",
      features: ["Auto Dungeon", "Auto Farm", "Auto Collect Rewards", "Breathing style switcher"],
      scriptCode: `local Players = game:GetService("Players")\nlocal player = Players.LocalPlayer\n\nlocal Hub = {}\nHub.AutoDungeon = true\nHub.AutoFarm = true\nHub.AutoCollect = true\n\nprint("Project Slayers 2 — Auto Dungeon loaded")`,
      version: "1.0",
      category: "Farming",
      tags: ["Auto Farm", "Dungeon", "Project Slayers 2"],
      published: true,
    },
  ],
  DOORS: [
    {
      title: "Entity ESP & Auto Run",
      description: "See entities through walls before they see you, with an optional auto-run assist for chase sequences.",
      features: ["Entity ESP", "Auto Run assist", "Item ESP", "Door counter"],
      scriptCode: `local Hub = { EntityESP = true, AutoRun = false }\nprint("DOORS ESP loaded")`,
      version: "1.1",
      category: "ESP",
      tags: ["ESP", "DOORS"],
      published: true,
    },
  ],
  "Pet Simulator 99": [
    {
      title: "Auto Hatch & Sell",
      description: "Opens eggs continuously and auto-sells duplicate pets below your chosen rarity.",
      features: ["Auto Hatch", "Auto Sell by rarity", "Auto equip best pets"],
      scriptCode: `local Hub = { AutoHatch = true }\nprint("Pet Sim 99 hub loaded")`,
      version: "1.0",
      category: "Farming",
      tags: ["Auto Farm", "Pets"],
      published: false,
    },
  ],
};

async function main() {
  await prisma.settings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: "Nebula Scripts",
      tagline: "Roblox scripts and showcases from my YouTube channel.",
      heroTitle: "Roblox Scripts",
      heroSubtitle: "Discover scripts, showcases, and updates from my YouTube channel.",
      youtubeChannel: "https://www.youtube.com/@example",
      discordUrl: "",
    },
    update: {},
  });

  for (const g of GAMES) {
    const game = await prisma.game.upsert({
      where: { name: g.name },
      create: { name: g.name, slug: slugify(g.name), description: g.description },
      update: { description: g.description },
    });

    for (const s of SCRIPTS[g.name] ?? []) {
      const slug = slugify(`${g.name}-${s.title}`);
      await prisma.script.upsert({
        where: { slug },
        create: { ...s, slug, gameId: game.id, thumbnail: null, youtubeUrl: s.youtubeUrl ?? null, scriptUrl: s.scriptUrl ?? null },
        update: { ...s, gameId: game.id },
      });
    }
  }

  await prisma.video.upsert({
    where: { id: "seed-tutorial-1" },
    create: {
      id: "seed-tutorial-1",
      title: "How to install any script (2 minutes)",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      kind: "TUTORIAL",
    },
    update: {},
  }).catch(() => {});

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

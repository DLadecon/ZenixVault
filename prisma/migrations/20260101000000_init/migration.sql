-- CreateEnum
CREATE TYPE "VideoKind" AS ENUM ('SHOWCASE', 'TUTORIAL');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "thumbnail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Script" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scriptCode" TEXT NOT NULL DEFAULT '',
    "scriptUrl" TEXT,
    "youtubeUrl" TEXT,
    "thumbnail" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "category" TEXT NOT NULL DEFAULT 'General',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "thumbnail" TEXT,
    "kind" "VideoKind" NOT NULL DEFAULT 'SHOWCASE',
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteName" TEXT NOT NULL DEFAULT 'Nebula Scripts',
    "tagline" TEXT NOT NULL DEFAULT 'Roblox scripts and showcases from my YouTube channel.',
    "heroTitle" TEXT NOT NULL DEFAULT 'Roblox Scripts',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Discover scripts, showcases, and updates from my YouTube channel.',
    "youtubeChannel" TEXT NOT NULL DEFAULT 'https://www.youtube.com/',
    "discordUrl" TEXT NOT NULL DEFAULT '',
    "logo" TEXT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");
CREATE UNIQUE INDEX "Script_slug_key" ON "Script"("slug");
CREATE INDEX "Script_published_createdAt_idx" ON "Script"("published", "createdAt" DESC);
CREATE INDEX "Script_gameId_published_idx" ON "Script"("gameId", "published");
CREATE INDEX "Script_featured_published_idx" ON "Script"("featured", "published");
CREATE INDEX "Script_category_idx" ON "Script"("category");
CREATE INDEX "Script_tags_idx" ON "Script" USING GIN ("tags");
CREATE INDEX "Video_kind_publishedAt_idx" ON "Video"("kind", "publishedAt" DESC);

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

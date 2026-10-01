import { z } from "zod";

const url = (label: string) =>
  z
    .string()
    .trim()
    .max(2048)
    .refine((v) => v === "" || /^https?:\/\//i.test(v), `${label} must start with http:// or https://`);

const tagsField = z
  .string()
  .max(500)
  .transform((v) =>
    v
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20),
  );

const featuresField = z
  .string()
  .max(4000)
  .transform((v) =>
    v
      .split("\n")
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 30),
  );

export const gameSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  description: z.string().trim().max(2000).default(""),
  thumbnail: z.string().max(300).optional().default(""),
});

export const scriptSchema = z.object({
  title: z.string().trim().min(2, "Title is too short").max(120),
  gameId: z.string().trim().min(1, "Choose a game"),
  description: z.string().trim().max(4000).default(""),
  features: featuresField.default(""),
  scriptCode: z.string().max(100_000).default(""),
  scriptUrl: url("Script URL").optional().default(""),
  youtubeUrl: url("YouTube URL").optional().default(""),
  thumbnail: z.string().max(300).optional().default(""),
  version: z.string().trim().max(30).default("1.0"),
  category: z.string().trim().max(40).default("General"),
  tags: tagsField.default(""),
  published: z.coerce.boolean().default(false),
  featured: z.coerce.boolean().default(false),
});

export const videoSchema = z.object({
  title: z.string().trim().min(2).max(160),
  youtubeUrl: url("YouTube URL").refine((v) => v !== "", "YouTube URL is required"),
  kind: z.enum(["SHOWCASE", "TUTORIAL"]).default("SHOWCASE"),
});

export const settingsSchema = z.object({
  siteName: z.string().trim().min(2).max(60),
  tagline: z.string().trim().max(200),
  heroTitle: z.string().trim().min(2).max(80),
  heroSubtitle: z.string().trim().max(200),
  youtubeChannel: url("YouTube channel URL"),
  discordUrl: url("Discord URL").optional().default(""),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

export type GameInput = z.infer<typeof gameSchema>;
export type ScriptInput = z.infer<typeof scriptSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;

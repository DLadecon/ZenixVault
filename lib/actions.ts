"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "./prisma";
import { requireAdmin, verifyCredentials, startSession, endSession } from "./auth";
import { gameSchema, scriptSchema, videoSchema, settingsSchema, loginSchema } from "./validation";
import { uniqueSlug } from "./slug";
import { rateLimit, getClientIp } from "./rate-limit";
import { UPLOAD_DIR, MAX_UPLOAD_BYTES, sniffImage } from "./uploads";

export type ActionState = { ok: boolean; message: string; fieldErrors?: Record<string, string> };

function fail(message: string, fieldErrors?: Record<string, string>): ActionState {
  return { ok: false, message, fieldErrors };
}

function zodFieldErrors(error: import("zod").ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}

// ── Auth ─────────────────────────────────────────────────────

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const h = await headers();
  const ip = getClientIp(h);
  const limited = rateLimit(`login:${ip}`, 8, 5 * 60 * 1000);
  if (!limited.ok) {
    return fail(`Too many attempts. Try again in ${Math.ceil(limited.retryAfterSec / 60)} minute(s).`);
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Enter a username and password.");

  const valid = await verifyCredentials(parsed.data.username, parsed.data.password);
  if (!valid) return fail("Incorrect username or password.");

  await startSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// ── Games ────────────────────────────────────────────────────

export async function createGame(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = gameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Check the highlighted fields.", zodFieldErrors(parsed.error));

  const slug = await uniqueSlug(parsed.data.name, async (s) => !!(await prisma.game.findUnique({ where: { slug: s } })));
  await prisma.game.create({ data: { ...parsed.data, slug, thumbnail: parsed.data.thumbnail || null } });

  revalidatePath("/");
  revalidatePath("/games");
  return { ok: true, message: "Game added." };
}

export async function updateGame(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = gameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Check the highlighted fields.", zodFieldErrors(parsed.error));

  const existing = await prisma.game.findUnique({ where: { id } });
  if (!existing) return fail("Game not found.");

  let slug = existing.slug;
  if (existing.name !== parsed.data.name) {
    slug = await uniqueSlug(parsed.data.name, async (s) => {
      if (s === existing.slug) return false;
      return !!(await prisma.game.findUnique({ where: { slug: s } }));
    });
  }

  await prisma.game.update({ where: { id }, data: { ...parsed.data, slug, thumbnail: parsed.data.thumbnail || null } });
  revalidatePath("/");
  revalidatePath("/games");
  revalidatePath(`/games/${slug}`);
  return { ok: true, message: "Game updated." };
}

export async function deleteGame(id: string): Promise<ActionState> {
  await requireAdmin();
  const count = await prisma.script.count({ where: { gameId: id } });
  if (count > 0) return fail(`Can't delete — ${count} script(s) still reference this game.`);
  await prisma.game.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/games");
  return { ok: true, message: "Game deleted." };
}

// ── Scripts ──────────────────────────────────────────────────

function revalidateScriptPaths(slug?: string, gameSlug?: string) {
  revalidatePath("/");
  revalidatePath("/scripts");
  if (slug) revalidatePath(`/scripts/${slug}`);
  if (gameSlug) revalidatePath(`/games/${gameSlug}`);
}

export async function createScript(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = scriptSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Check the highlighted fields.", zodFieldErrors(parsed.error));

  const game = await prisma.game.findUnique({ where: { id: parsed.data.gameId } });
  if (!game) return fail("Select a valid game.", { gameId: "Select a valid game" });

  const slug = await uniqueSlug(
    `${game.name}-${parsed.data.title}`,
    async (s) => !!(await prisma.script.findUnique({ where: { slug: s } })),
  );

  await prisma.script.create({
    data: {
      ...parsed.data,
      slug,
      scriptUrl: parsed.data.scriptUrl || null,
      youtubeUrl: parsed.data.youtubeUrl || null,
      thumbnail: parsed.data.thumbnail || null,
    },
  });

  revalidateScriptPaths(slug, game.slug);
  return { ok: true, message: "Script created." };
}

export async function updateScript(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = scriptSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Check the highlighted fields.", zodFieldErrors(parsed.error));

  const existing = await prisma.script.findUnique({ where: { id }, include: { game: true } });
  if (!existing) return fail("Script not found.");

  const game = await prisma.game.findUnique({ where: { id: parsed.data.gameId } });
  if (!game) return fail("Select a valid game.", { gameId: "Select a valid game" });

  let slug = existing.slug;
  if (existing.title !== parsed.data.title || existing.gameId !== parsed.data.gameId) {
    slug = await uniqueSlug(`${game.name}-${parsed.data.title}`, async (s) => {
      if (s === existing.slug) return false;
      return !!(await prisma.script.findUnique({ where: { slug: s } }));
    });
  }

  await prisma.script.update({
    where: { id },
    data: {
      ...parsed.data,
      slug,
      scriptUrl: parsed.data.scriptUrl || null,
      youtubeUrl: parsed.data.youtubeUrl || null,
      thumbnail: parsed.data.thumbnail || null,
    },
  });

  revalidateScriptPaths(existing.slug, existing.game.slug);
  revalidateScriptPaths(slug, game.slug);
  return { ok: true, message: "Script updated." };
}

export async function deleteScript(id: string): Promise<ActionState> {
  await requireAdmin();
  const existing = await prisma.script.findUnique({ where: { id }, include: { game: true } });
  if (!existing) return fail("Script not found.");
  await prisma.script.delete({ where: { id } });
  revalidateScriptPaths(existing.slug, existing.game.slug);
  return { ok: true, message: "Script deleted." };
}

export async function togglePublished(id: string, value: boolean): Promise<ActionState> {
  await requireAdmin();
  const s = await prisma.script.update({ where: { id }, data: { published: value }, include: { game: true } });
  revalidateScriptPaths(s.slug, s.game.slug);
  return { ok: true, message: value ? "Published." : "Unpublished." };
}

export async function toggleFeatured(id: string, value: boolean): Promise<ActionState> {
  await requireAdmin();
  if (value) {
    // Only one featured script at a time keeps the homepage's featured slot meaningful.
    await prisma.script.updateMany({ where: { featured: true }, data: { featured: false } });
  }
  const s = await prisma.script.update({ where: { id }, data: { featured: value }, include: { game: true } });
  revalidateScriptPaths(s.slug, s.game.slug);
  return { ok: true, message: value ? "Featured." : "Unfeatured." };
}

// ── Videos ───────────────────────────────────────────────────

export async function createVideo(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = videoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Check the highlighted fields.", zodFieldErrors(parsed.error));
  await prisma.video.create({ data: parsed.data });
  revalidatePath("/tutorials");
  return { ok: true, message: "Video added." };
}

export async function deleteVideo(id: string): Promise<ActionState> {
  await requireAdmin();
  await prisma.video.delete({ where: { id } });
  revalidatePath("/tutorials");
  return { ok: true, message: "Video deleted." };
}

// ── Settings ─────────────────────────────────────────────────

export async function updateSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Check the highlighted fields.", zodFieldErrors(parsed.error));
  await prisma.settings.upsert({ where: { id: 1 }, create: { id: 1, ...parsed.data }, update: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}

// ── Uploads ──────────────────────────────────────────────────

export async function uploadThumbnail(_prev: ActionState, formData: FormData): Promise<ActionState & { url?: string }> {
  await requireAdmin();
  const h = await headers();
  const limited = rateLimit(`upload:${getClientIp(h)}`, 30, 60 * 1000);
  if (!limited.ok) return fail("Too many uploads — slow down and try again.");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Choose an image file.");
  if (file.size > MAX_UPLOAD_BYTES) return fail("Image is too large (max 3 MB).");

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniffImage(buf);
  if (!kind) return fail("Unsupported image type. Use PNG, JPG, WebP or GIF.");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}.${kind.ext}`;
  await writeFile(path.join(UPLOAD_DIR, name), buf);

  return { ok: true, message: "Uploaded.", url: `/uploads/${name}` };
}

export async function deleteUploadedFile(url: string): Promise<void> {
  await requireAdmin();
  if (!url.startsWith("/uploads/")) return;
  const name = url.replace("/uploads/", "");
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp|gif)$/.test(name)) return;
  await unlink(path.join(UPLOAD_DIR, name)).catch(() => {});
}

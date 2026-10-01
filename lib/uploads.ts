import "server-only";
import path from "node:path";

export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads"));
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3 MB

export type ImageKind = { ext: "png" | "jpg" | "webp" | "gif"; mime: string };

/**
 * Detects the real image type from the file's leading bytes ("magic numbers").
 * The browser-supplied Content-Type and filename are never trusted.
 * SVG is intentionally NOT allowed: SVG files can carry scripts.
 */
export function sniffImage(buf: Buffer): ImageKind | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") return { ext: "png", mime: "image/png" };
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (buf.toString("ascii", 0, 4) === "GIF8") return { ext: "gif", mime: "image/gif" };
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return { ext: "webp", mime: "image/webp" };
  }
  return null;
}

export const UPLOAD_NAME = /^[a-f0-9-]{36}\.(png|jpg|webp|gif)$/;

export const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

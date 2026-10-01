import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE, SESSION_MAX_AGE, COOKIE_SECURE, signSession, verifySession } from "./session";

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

/**
 * Server-side authorization gate. Call at the top of EVERY admin page, server
 * action and API handler. (Middleware is a first line of defence, not the only one.)
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

/** Constant-time credential check against ADMIN_USERNAME + ADMIN_PASSWORD_HASH_B64. */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME;
  const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (!expectedUser || !hashB64) return false;

  const hash = Buffer.from(hashB64, "base64").toString("utf8");
  const userOk = timingSafeEqual(digest(username), digest(expectedUser));
  // Always run bcrypt so response time doesn't reveal whether the username was right.
  const passOk = await bcrypt.compare(password, hash).catch(() => false);
  return userOk && passOk;
}

export async function startSession(): Promise<void> {
  const token = await signSession();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

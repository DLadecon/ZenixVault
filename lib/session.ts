// Edge-safe session helpers (used by middleware and server code). No Node-only imports here.
import { SignJWT, jwtVerify } from "jose";

const isProd = process.env.NODE_ENV === "production";

/** Secure cookies are on in production unless you explicitly opt out for local http testing. */
export const COOKIE_SECURE = isProd && process.env.INSECURE_COOKIES !== "true";

// The __Host- prefix makes browsers reject the cookie unless it is Secure, Path=/ and has no Domain.
export const SESSION_COOKIE = COOKIE_SECURE ? "__Host-admin_session" : "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to a random string of at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return payload.sub === "admin" && payload.role === "admin";
  } catch {
    return false;
  }
}

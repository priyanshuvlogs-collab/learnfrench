import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "./db";

/**
 * Cookie-based JWT sessions. AUTH_SECRET should be set in production;
 * the dev fallback keeps the demo runnable out of the box.
 */

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET ?? "lumen-dev-secret-change-in-production");
export const SESSION_COOKIE = "lumen_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  uid: string;
  role: "STUDENT" | "ADMIN";
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ uid: payload.uid, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (typeof payload.uid !== "string") return null;
    return { uid: payload.uid, role: payload.role === "ADMIN" ? "ADMIN" : "STUDENT" };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN";
  plan: "FREE" | "PREMIUM";
  active: boolean;
}

/** Resolve the current request's user from the session cookie (or null). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.uid } });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role === "ADMIN" ? "ADMIN" : "STUDENT",
    plan: user.plan === "PREMIUM" ? "PREMIUM" : "FREE",
    active: user.active,
  };
}

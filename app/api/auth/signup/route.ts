import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!name) return NextResponse.json({ error: "name-required" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "invalid-email" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "password-too-short" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "email-taken" }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      role: "STUDENT",
      plan: "FREE", // freemium: everyone starts free; admin grants premium
      active: true,
      lastLoginAt: new Date(),
    },
  });

  const token = await createSessionToken({ uid: user.id, role: "STUDENT" });
  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, plan: user.plan, active: user.active },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}

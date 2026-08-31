import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

/** GET: list all students with snapshots. Admin only. */
export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    include: { snapshot: true },
  });

  return NextResponse.json({
    students: students.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      plan: s.plan,
      active: s.active,
      createdAt: s.createdAt,
      lastLoginAt: s.lastLoginAt,
      snapshot: s.snapshot
        ? {
            streakCurrent: s.snapshot.streakCurrent,
            streakLongest: s.snapshot.streakLongest,
            minutesTotal: s.snapshot.minutesTotal,
            sessionsCount: s.snapshot.sessionsCount,
            weakestSkill: s.snapshot.weakestSkill,
            exam: s.snapshot.exam,
            targetNCLC: s.snapshot.targetNCLC,
            estimates: JSON.parse(s.snapshot.estimatesJson || "{}"),
            lastActive: s.snapshot.lastActive,
            updatedAt: s.snapshot.updatedAt,
          }
        : null,
    })),
  });
}

/** POST: admin creates a student account (with a temporary password). */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  let body: { name?: string; email?: string; password?: string; plan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || password.length < 8) {
    return NextResponse.json({ error: "invalid-input" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "email-taken" }, { status: 409 });

  const created = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      role: "STUDENT",
      plan: body.plan === "PREMIUM" ? "PREMIUM" : "FREE",
      active: true,
    },
  });
  return NextResponse.json({ id: created.id });
}

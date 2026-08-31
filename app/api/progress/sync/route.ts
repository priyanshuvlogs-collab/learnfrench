import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Upserts the student's progress snapshot so the admin dashboard can
 * show streaks, minutes and weakest skills without moving all learning
 * data server-side. Fired by the client after sessions and on load.
 */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  let body: {
    streakCurrent?: number;
    streakLongest?: number;
    minutesTotal?: number;
    sessionsCount?: number;
    weakestSkill?: string;
    exam?: string;
    targetNCLC?: number;
    estimates?: Record<string, number>;
    lastActive?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }

  const data = {
    streakCurrent: Math.max(0, Math.floor(body.streakCurrent ?? 0)),
    streakLongest: Math.max(0, Math.floor(body.streakLongest ?? 0)),
    minutesTotal: Math.max(0, Math.floor(body.minutesTotal ?? 0)),
    sessionsCount: Math.max(0, Math.floor(body.sessionsCount ?? 0)),
    weakestSkill: String(body.weakestSkill ?? "").slice(0, 20),
    exam: String(body.exam ?? "").slice(0, 12),
    targetNCLC: Math.max(4, Math.min(10, Math.floor(body.targetNCLC ?? 7))),
    estimatesJson: JSON.stringify(body.estimates ?? {}).slice(0, 500),
    lastActive: String(body.lastActive ?? "").slice(0, 10),
  };

  await prisma.progressSnapshot.upsert({
    where: { userId: user.id },
    update: data,
    create: { userId: user.id, ...data },
  });

  return NextResponse.json({ ok: true });
}

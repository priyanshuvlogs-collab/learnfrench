import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

/** PATCH: toggle a student's plan (FREE/PREMIUM) or access (active). */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await params;
  let body: { plan?: string; active?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || target.role !== "STUDENT") return NextResponse.json({ error: "not-found" }, { status: 404 });

  const data: { plan?: string; active?: boolean } = {};
  if (body.plan === "FREE" || body.plan === "PREMIUM") data.plan = body.plan;
  if (typeof body.active === "boolean") data.active = body.active;
  if (Object.keys(data).length === 0) return NextResponse.json({ error: "nothing-to-update" }, { status: 400 });

  const updated = await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ id: updated.id, plan: updated.plan, active: updated.active });
}

/** DELETE: remove a student account entirely. */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target || target.role !== "STUDENT") return NextResponse.json({ error: "not-found" }, { status: 404 });

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

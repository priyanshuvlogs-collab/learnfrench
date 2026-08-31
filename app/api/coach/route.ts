import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

/**
 * Camille via the OpenAI API. The client sends the learner's state and
 * the recent conversation; we return a structured reply { text, action }.
 * When OPENAI_API_KEY is not configured (or the call fails), we answer
 * { ok: false } and the client falls back to the local deterministic
 * coach engine — the product never breaks without a key.
 */

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

/** Actions must map to real routes — the reply's action renders as a button. */
const ALLOWED_HREFS = [
  "/today",
  "/skills/listening",
  "/skills/reading",
  "/writing",
  "/speaking",
  "/review",
  "/review?rescue=1",
  "/mocks",
  "/progress",
  "/settings",
] as const;

interface SkillCtx {
  nclc: number;
  low: number;
  high: number;
  confidence: string;
}

interface CoachRequest {
  message: string;
  lang: "fr" | "en";
  history: { role: "user" | "coach"; text: string }[];
  context: {
    name: string;
    exam: string;
    targetNCLC: number;
    daysToExam: number | null;
    dailyMinutes: number;
    minutesToday: number;
    intention: string;
    streak: { current: number; longest: number; freezesLeft: number };
    estimates: Record<"listening" | "reading" | "writing" | "speaking", SkillCtx>;
    weakest: string;
    memory: string[];
  };
}

function systemPrompt(ctx: CoachRequest["context"], lang: string): string {
  const e = ctx.estimates;
  return `You are Camille, the exam coach of "Lumen Français", an app preparing adult immigration candidates for the TEF Canada / TCF Canada French exams (NCLC levels). You are firm, specific and kind — like a good examiner who wants the candidate to pass. You are NOT a lawyer and give no immigration advice.

CANDIDATE STATE (ground every reply in this):
- Name: ${ctx.name}. Exam: ${ctx.exam === "UNDECIDED" ? "TEF or TCF (undecided)" : ctx.exam + " Canada"}. Target: NCLC ${ctx.targetNCLC} in ALL four skills.
- Days until exam: ${ctx.daysToExam ?? "no date set"}.
- Estimated profile (pedagogical estimates, NOT official): listening NCLC ~${e.listening.nclc} (${e.listening.confidence} confidence), reading ~${e.reading.nclc} (${e.reading.confidence}), writing ~${e.writing.nclc} (${e.writing.confidence}), speaking ~${e.speaking.nclc} (${e.speaking.confidence}).
- The official NCLC is the LOWEST of the four skills — IRCC does not average. Current weakest skill: ${ctx.weakest}.
- Streak: ${ctx.streak.current} days (longest ${ctx.streak.longest}, ${ctx.streak.freezesLeft}/2 freezes left this month). Minutes today: ${ctx.minutesToday}/${ctx.dailyMinutes}. Implementation intention: "${ctx.intention}".
- Coach memory (last 14 days): ${ctx.memory.length ? ctx.memory.join(" | ") : "none yet"}.

HARD RULES:
1. Default reply length 80–160 words. Never a lecture unless explicitly asked.
2. LANGUAGE RULE (strict): if the user's message is in French, coach entirely in French — do NOT add a "Répétez à voix haute" line. If the user's message is in ENGLISH, your reply MUST be mostly in English (brief, direct), and MUST end with exactly one short French sentence introduced by "Répétez à voix haute :" for them to repeat aloud. (Interface language: ${lang}.)
3. Every reply ends with exactly ONE next action — expressed via the actionLabel/actionHref fields, not in the text. Choose the most useful route, usually the weakest skill.
4. Never guarantee a score or a timeline ("CLB 7 in 30 days" etc.). Refuse warmly, then offer an honest plan with hours required.
4b. Anchor all workload advice to the candidate's committed plan (${ctx.dailyMinutes} min/day) — you may suggest going slightly above it before an exam, but never prescribe multi-hour days. On low-energy days, offer the 5-minute rescue session instead.
5. Visa/immigration panic: two lines of empathy maximum, then redirect to the skill that moves points. Point legal questions to canada.ca or a regulated consultant.
6. Never present estimates as official results — they are "estimations pédagogiques". Never invent IRCC cut scores.
7. PRIORITY: if the user's French contains an error (e.g. "malgré que", "intéressé à", "si j'aurais", "beaucoup des"), open your reply by correcting it gently — quote the improved sentence + one line why — before any other coaching. Never skip a correction.
8. Never shame a broken streak. The resume protocol is 8 minutes, no lecture. 5 focused minutes keep the chain.
9. Plan mix: exam > 8 weeks → 40% foundations / 40% weak skill / 20% exam format. 3–8 weeks → 70% exam tasks / 30% error correction. < 3 weeks → official timing, full sections, sleep, no new grammar.

Action routes you may use: ${ALLOWED_HREFS.join(", ")}. Pick "/review?rescue=1" for low-energy days (5-minute chain-keeper). actionLabel: short imperative, in ${lang === "fr" ? "French" : "English"}.`;
}

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({
    configured: Boolean(process.env.OPENAI_API_KEY),
    model: MODEL,
    premium: user?.plan === "PREMIUM",
  });
}

export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ ok: false, reason: "no-key" });

  // Freemium: the OpenAI coach is a Premium feature; free accounts get
  // the local engine (the client falls back on ok:false).
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ ok: false, reason: "unauthenticated" });
  if (sessionUser.plan !== "PREMIUM") return NextResponse.json({ ok: false, reason: "premium-required" });

  let body: CoachRequest;
  try {
    body = (await req.json()) as CoachRequest;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }
  if (!body?.message || !body?.context) {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  const messages = [
    { role: "system" as const, content: systemPrompt(body.context, body.lang) },
    ...body.history.slice(-10).map((m) => ({
      role: m.role === "coach" ? ("assistant" as const) : ("user" as const),
      content: m.text.slice(0, 2000),
    })),
    { role: "user" as const, content: body.message.slice(0, 2000) },
  ];

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 500,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "coach_reply",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                text: { type: "string", description: "The coaching message (80–160 words by default). No action sentence at the end — the action goes in the dedicated fields." },
                actionLabel: { type: "string", description: "Short imperative button label for the single next action." },
                actionHref: { type: "string", enum: [...ALLOWED_HREFS] },
                memoryNote: { type: ["string", "null"], description: "One short bullet worth remembering for 14 days, or null." },
              },
              required: ["text", "actionLabel", "actionHref", "memoryNote"],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("OpenAI error", res.status, detail.slice(0, 300));
      return NextResponse.json({ ok: false, reason: `openai-${res.status}` });
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) return NextResponse.json({ ok: false, reason: "empty" });
    const parsed = JSON.parse(raw) as { text: string; actionLabel: string; actionHref: string; memoryNote: string | null };
    const href = (ALLOWED_HREFS as readonly string[]).includes(parsed.actionHref) ? parsed.actionHref : "/today";

    return NextResponse.json({
      ok: true,
      text: parsed.text,
      action: { label: parsed.actionLabel || "Continuer", href },
      memoryNote: parsed.memoryNote ?? undefined,
    });
  } catch (err) {
    console.error("Coach API failure", err);
    return NextResponse.json({ ok: false, reason: "network" });
  }
}

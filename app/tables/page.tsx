"use client";

import { useState } from "react";
import { PublicFooter, PublicNav } from "@/components/public-chrome";
import { Badge, Disclaimer, Kicker } from "@/components/ui";
import { ALL_TABLES, CANADA_CA_URL, TABLES_LAST_VERIFIED } from "@/content/tables";
import { SKILL_LABELS, SKILLS } from "@/lib/types";

export default function TablesPage() {
  const [tab, setTab] = useState(0);
  const table = ALL_TABLES[tab];
  const levels = [...new Set(SKILLS.flatMap((s) => Object.keys(table.skills[s]).map(Number)))].sort((a, b) => b - a);

  return (
    <>
      <PublicNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12">
        <Kicker>Official tables</Kicker>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Score → NCLC conversion</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge tone="ink">Last verified: {TABLES_LAST_VERIFIED}</Badge>
          <a
            href={CANADA_CA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-2"
          >
            Check on canada.ca ↗
          </a>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-2">
          <strong>Watch the two TEF columns:</strong> your TEF certificate may show a 0–699 score{" "}
          <em>and</em> an “Équivalence ancien score”. For Express Entry, IRCC instructions ask for
          the “ancien score” correspondence; other IRCC pages (PNPs, etc.) use the /699 scale. Copy
          the column <em>your</em> programme asks for.
        </p>

        <div className="mt-8 flex flex-wrap gap-2" role="tablist">
          {ALL_TABLES.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                i === tab ? "bg-accent text-white" : "border border-line bg-white text-ink-2 hover:border-accent hover:text-accent"
              }`}
            >
              {t.label.en.split("—")[0].trim()}
              <span className="ml-2 hidden text-xs font-normal opacity-70 sm:inline">{t.scale}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-line bg-white p-5">
          <h2 className="font-semibold">{table.label.en}</h2>
          <p className="mt-1 text-sm text-ink-2">{table.note.en}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-line text-left">
                  <th className="py-2 pr-3 font-semibold">NCLC</th>
                  {SKILLS.map((s) => (
                    <th key={s} className="px-3 py-2 font-semibold">
                      {SKILL_LABELS[s].en}
                      <span className="ml-1 text-xs font-normal text-ink-3">({SKILL_LABELS[s].short})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {levels.map((lvl) => (
                  <tr key={lvl} className={`border-b border-line ${lvl === 7 ? "bg-accent-soft/60" : ""}`}>
                    <td className="py-2.5 pr-3 font-display text-base font-semibold">
                      {lvl}
                      {lvl === 7 && <span className="ml-2 align-middle text-[10px] font-sans font-semibold uppercase tracking-wide text-accent">common EE target</span>}
                    </td>
                    {SKILLS.map((s) => {
                      const band = table.skills[s][lvl];
                      return (
                        <td key={s} className="px-3 py-2.5 font-display tabular-nums">
                          {band ? (band[0] === band[1] ? band[0] : `${band[0]}–${band[1]}`) : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-paper-2 p-5">
          <Disclaimer />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}

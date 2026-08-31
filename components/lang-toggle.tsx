"use client";

import { useApp } from "@/lib/store";
import { useLang } from "@/lib/i18n";
import { UiLang } from "@/lib/types";

export function LangToggle({ className = "" }: { className?: string }) {
  const lang = useLang();
  const updateProfile = useApp((s) => s.updateProfile);
  const set = (l: UiLang) => updateProfile({ uiLang: l });
  return (
    <div
      className={`inline-flex overflow-hidden rounded-lg border border-line text-xs font-semibold ${className}`}
      role="group"
      aria-label="Interface language / Langue de l'interface"
    >
      {(["en", "fr"] as UiLang[]).map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-1.5 uppercase transition-colors ${
            lang === l ? "bg-accent text-white" : "bg-white text-ink-2 hover:text-accent"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useApp } from "./store";
import { UiLang } from "./types";

/** Current UI language. English is the main language by default; the
 * learner can switch to full French once comfortable. */
export function useLang(): UiLang {
  return useApp((s) => s.profile?.uiLang ?? "en");
}

/** Pick the string for the current UI language. */
export function L(lang: UiLang, fr: string, en: string): string {
  return lang === "fr" ? fr : en;
}

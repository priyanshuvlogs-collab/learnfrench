"use client";

import { RefObject } from "react";

const CHARS = ["é", "è", "ê", "à", "ç", "ù", "û", "î", "ï", "ô", "œ"];

/**
 * Barre d'accents pour les claviers sans caractères français.
 * Insère au niveau du curseur et déclenche l'onChange du parent.
 */
export function AccentBar({
  targetRef,
  onInsert,
}: {
  targetRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onInsert: (nextValue: string) => void;
}) {
  function insert(ch: string) {
    const el = targetRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + ch + el.value.slice(end);
    onInsert(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  }

  return (
    <div className="flex flex-wrap gap-1.5" role="toolbar" aria-label="Insert an accented character">
      {CHARS.map((ch) => (
        <button
          key={ch}
          type="button"
          // onMouseDown + preventDefault pour ne pas voler le focus du champ
          onMouseDown={(e) => {
            e.preventDefault();
            insert(ch);
          }}
          className="h-8 w-8 rounded-md border border-line bg-white text-sm font-semibold text-ink-2 hover:border-accent hover:text-accent"
        >
          {ch}
        </button>
      ))}
    </div>
  );
}

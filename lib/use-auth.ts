"use client";

import { useEffect, useSyncExternalStore } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  plan: "FREE" | "PREMIUM";
  active: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loaded: boolean;
}

let state: AuthState = { user: null, loaded: false };
const INITIAL: AuthState = state;
const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;

function setState(next: AuthState) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export async function refreshAuth(): Promise<void> {
  if (!inflight) {
    inflight = fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setState({ user: d.user ?? null, loaded: true }))
      .catch(() => setState({ user: null, loaded: true }))
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function logoutAuth(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    setState({ user: null, loaded: true });
  }
}

/** Session user from the server cookie — the source of truth for role & plan. */
export function useAuth(): AuthState {
  const snap = useSyncExternalStore(subscribe, () => state, () => INITIAL);
  useEffect(() => {
    if (!state.loaded) void refreshAuth();
  }, []);
  return snap;
}

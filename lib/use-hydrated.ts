"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** True once the client has hydrated (zustand-persist data is readable). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

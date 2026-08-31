"use client";

/**
 * Browser notifications for the goal tracker. Opt-in only
 * (profile.notificationsOptIn) and never guilt-based — they announce
 * recorded work and reached goals, not lost streaks.
 */

export function canNotify(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notifyPermission(): NotificationPermission | "unsupported" {
  return canNotify() ? Notification.permission : "unsupported";
}

export async function enableNotifications(): Promise<boolean> {
  if (!canNotify()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const res = await Notification.requestPermission();
  return res === "granted";
}

export function notify(title: string, body: string): void {
  try {
    if (!canNotify() || Notification.permission !== "granted") return;
    new Notification(title, { body, icon: "/favicon.ico", tag: `lumen-${Date.now()}` });
  } catch {
    // notifications are best-effort; never break the session flow
  }
}

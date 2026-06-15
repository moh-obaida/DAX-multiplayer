import { logEvent as firebaseLogEvent } from "firebase/analytics";
import { getAnalytics, isSupported } from "firebase/analytics";
import { app, isFirebaseConfigured } from "./firebase";

let analytics: ReturnType<typeof getAnalytics> | null = null;

async function getAnalyticsInstance() {
  if (!isFirebaseConfigured || analytics) return analytics;
  const supported = await isSupported();
  if (!supported) return null;
  analytics = getAnalytics(app);
  return analytics;
}

export async function trackEvent(name: string, params?: Record<string, string | number>) {
  try {
    const gaId = import.meta.env.VITE_GA_ID;
    if (gaId && typeof window !== "undefined" && (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...a: unknown[]) => void }).gtag("event", name, params);
    }
    const inst = await getAnalyticsInstance();
    if (inst) firebaseLogEvent(inst, name, params);
  } catch {
    // analytics optional
  }
}

export const analyticsEvents = {
  roomCreated: (code: string, maxPlayers: number) =>
    trackEvent("room_created", { room_code: code, max_players: maxPlayers }),
  gameStarted: (playerCount: number) =>
    trackEvent("game_started", { player_count: playerCount }),
  gameEnded: (winnerId: string, durationSec: number) =>
    trackEvent("game_ended", { winner_id: winnerId, duration_sec: durationSec }),
  playerDisconnected: (reason: string) =>
    trackEvent("player_disconnected", { reason }),
  joinFailed: () => trackEvent("join_failed"),
};

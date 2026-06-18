import { ensureAuth, isFirebaseConfigured } from "./firebase";

const GUEST_KEY = "dax-guest-id";

export function getStableGuestId(): string {
  try {
    const existing = localStorage.getItem(GUEST_KEY);
    if (existing) return existing;
    const id = `guest-${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_KEY, id);
    return id;
  } catch {
    return `guest-${Date.now()}`;
  }
}

/** Firebase multiplayer uses auth.uid; offline/demo uses a stable guest id. */
export async function resolvePlayerId(): Promise<string> {
  if (isFirebaseConfigured) {
    const user = await ensureAuth();
    if (user?.uid) return user.uid;
  }
  return getStableGuestId();
}

import type { Room } from "../store/roomStore";

const STORAGE_KEY = "dax-rooms";

export function loadRoomRegistry(): Record<string, Room> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Room>) : {};
  } catch {
    return {};
  }
}

export function getStoredRoom(code: string): Room | null {
  return loadRoomRegistry()[code] ?? null;
}

export function saveRoom(room: Room): void {
  const registry = loadRoomRegistry();
  registry[room.code] = room;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
}

export function removeStoredRoom(code: string): void {
  const registry = loadRoomRegistry();
  delete registry[code];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
}

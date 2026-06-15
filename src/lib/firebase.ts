import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  onValue,
  off,
  remove,
  type DatabaseReference,
} from "firebase/database";
import type { GameState, Player, CardColor } from "../types/game";
import type { FirebaseRoom, FirebaseRoomSettings, FirebasePlayer, ChatMessage } from "../types/firebase";
import { DEFAULT_ROOM_SETTINGS, generateRoomCode } from "./constants";
import { gameStateToFirebase, firebaseToGameState, initializeGame, syncPlayersHands } from "./gameLogic";
import { analyticsEvents } from "./analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.databaseURL && firebaseConfig.projectId
);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

let authReady: Promise<User | null> | null = null;

export function ensureAuth(): Promise<User | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null);
  if (!authReady) {
    authReady = new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          unsub();
          resolve(user);
        } else {
          try {
            const cred = await signInAnonymously(auth);
            unsub();
            resolve(cred.user);
          } catch {
            unsub();
            resolve(null);
          }
        }
      });
    });
  }
  return authReady;
}

function roomRef(code: string): DatabaseReference {
  return ref(database, `rooms/${code}`);
}

const PLAYER_COLORS: CardColor[] = ["red", "blue", "green", "yellow"];

let lastCreateRoomAt = 0;
const CREATE_ROOM_COOLDOWN_MS = 30_000;

export async function createRoom(
  hostId: string,
  hostName: string,
  settings?: Partial<FirebaseRoomSettings>
): Promise<FirebaseRoom> {
  const now = Date.now();
  if (now - lastCreateRoomAt < CREATE_ROOM_COOLDOWN_MS) {
    throw new Error("RATE_LIMIT");
  }
  lastCreateRoomAt = now;
  const code = generateRoomCode();
  const room: FirebaseRoom = {
    code,
    hostId,
    status: "waiting",
    createdAt: Date.now(),
    lastActivity: Date.now(),
    gameState: null,
    messages: [],
    settings: { ...DEFAULT_ROOM_SETTINGS, ...settings },
    players: [{
      id: hostId,
      name: hostName,
      color: PLAYER_COLORS[0],
      hand: [],
      role: "host",
      avatarId: "avatar-1",
      isReady: true,
      afkStrikes: 0,
      hasCalledUno: false,
      status: "active",
    }],
  };

  if (isFirebaseConfigured) {
    await ensureAuth();
    await set(roomRef(code), room);
  } else {
    localRooms[code] = room;
    persistLocalRooms();
  }
  void analyticsEvents.roomCreated(code, room.settings.maxPlayers);
  return room;
}

export async function joinRoom(
  code: string,
  playerId: string,
  playerName: string
): Promise<FirebaseRoom | null> {
  const room = await getRoom(code);
  if (!room || room.status !== "waiting") return null;
  if (room.players.length >= room.settings.maxPlayers) return null;
  if (room.players.some((p) => p.id === playerId)) return room;

  const newPlayer: FirebasePlayer = {
    id: playerId,
    name: playerName,
    color: PLAYER_COLORS[room.players.length % PLAYER_COLORS.length],
    hand: [],
    role: "player",
    avatarId: `avatar-${(room.players.length % 8) + 1}`,
    isReady: false,
    afkStrikes: 0,
    hasCalledUno: false,
    status: "active",
  };

  const updated: FirebaseRoom = {
    ...room,
    lastActivity: Date.now(),
    players: [...room.players, newPlayer],
  };

  if (isFirebaseConfigured) {
    await update(roomRef(code), { players: updated.players, lastActivity: updated.lastActivity });
  } else {
    localRooms[code] = updated;
    persistLocalRooms();
  }
  return updated;
}

export async function getRoom(code: string): Promise<FirebaseRoom | null> {
  if (isFirebaseConfigured) {
    const snap = await get(roomRef(code));
    return snap.exists() ? (snap.val() as FirebaseRoom) : null;
  }
  return localRooms[code] ?? null;
}

export async function updateRoom(code: string, data: Partial<FirebaseRoom>): Promise<void> {
  if (isFirebaseConfigured) {
    await update(roomRef(code), { ...data, lastActivity: Date.now() });
  } else {
    const room = localRooms[code];
    if (room) {
      localRooms[code] = { ...room, ...data, lastActivity: Date.now() };
      persistLocalRooms();
    }
  }
}

export async function startGameInRoom(code: string, players: Player[], hostId: string, handSize: number): Promise<GameState> {
  const game = initializeGame(players, hostId, handSize, code);
  const payload = gameStateToFirebase(game);

  if (isFirebaseConfigured) {
    await update(roomRef(code), {
      status: "playing",
      gameState: payload,
      players: syncPlayersHands(game),
      lastActivity: Date.now(),
    });
  } else {
    const room = localRooms[code];
    if (room) {
      localRooms[code] = {
        ...room,
        status: "playing",
        gameState: payload,
        players: syncPlayersHands(game),
        lastActivity: Date.now(),
      };
      persistLocalRooms();
    }
  }
  void analyticsEvents.gameStarted(players.length);
  return game;
}

export async function submitPlay(code: string, game: GameState): Promise<void> {
  const payload = gameStateToFirebase(game);
  const players = syncPlayersHands(game);
  const status = game.gameStatus === "finished" ? "ended" : "playing";

  if (isFirebaseConfigured) {
    await update(roomRef(code), { gameState: payload, players, status, lastActivity: Date.now() });
  } else {
    const room = localRooms[code];
    if (room) {
      localRooms[code] = {
        ...room,
        gameState: payload,
        players,
        status: status as FirebaseRoom["status"],
        lastActivity: Date.now(),
      };
      persistLocalRooms();
    }
  }
  if (status === "ended" && game.winners[0]) {
    const durationSec = Math.round((Date.now() - game.createdAt) / 1000);
    void analyticsEvents.gameEnded(game.winners[0], durationSec);
  }
}

export async function getGameState(code: string): Promise<GameState | null> {
  const room = await getRoom(code);
  if (!room?.gameState) return null;
  return firebaseToGameState(room);
}

export function subscribeRoom(
  code: string,
  callback: (room: FirebaseRoom | null) => void
): () => void {
  if (!isFirebaseConfigured) {
    const poll = () => callback(localRooms[code] ?? null);
    poll();
    const id = setInterval(poll, 500);
    return () => clearInterval(id);
  }

  const r = roomRef(code);
  const handler = (snap: { exists: () => boolean; val: () => FirebaseRoom }) => {
    callback(snap.exists() ? snap.val() : null);
  };
  onValue(r, handler);
  return () => off(r, "value", handler);
}

export async function sendMessage(code: string, message: ChatMessage): Promise<void> {
  const room = await getRoom(code);
  if (!room) return;
  const messages = [...room.messages.slice(-49), message];
  await updateRoom(code, { messages });
}

export async function leaveRoom(code: string, playerId: string): Promise<void> {
  const room = await getRoom(code);
  if (!room) return;

  const remaining = room.players.filter((p) => p.id !== playerId);
  if (remaining.length === 0) {
    if (isFirebaseConfigured) await remove(roomRef(code));
    else {
      delete localRooms[code];
      persistLocalRooms();
    }
    return;
  }

  const hostLeft = room.hostId === playerId;
  const updated: Partial<FirebaseRoom> = {
    players: remaining.map((p, i) => ({
      ...p,
      role: hostLeft && i === 0 ? "host" : p.role === "host" && !hostLeft ? "host" : "player",
    })),
    hostId: hostLeft ? remaining[0].id : room.hostId,
    status: hostLeft && room.status === "playing" ? "ended" : room.status,
  };

  if (hostLeft && room.status === "playing") {
    updated.gameState = room.gameState;
  }

  await updateRoom(code, updated);
}

export async function toggleReady(code: string, playerId: string): Promise<void> {
  const room = await getRoom(code);
  if (!room) return;
  const players = room.players.map((p) =>
    p.id === playerId ? { ...p, isReady: !p.isReady } : p
  );
  await updateRoom(code, { players });
}

export async function updateRoomSettings(
  code: string,
  settings: Partial<FirebaseRoom["settings"]>
): Promise<void> {
  const room = await getRoom(code);
  if (!room) return;
  await updateRoom(code, { settings: { ...room.settings, ...settings } });
}

// Local fallback storage when Firebase is not configured
const LOCAL_KEY = "dax-firebase-rooms";
let localRooms: Record<string, FirebaseRoom> = {};

function persistLocalRooms() {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(localRooms));
  } catch { /* ignore */ }
}

function loadLocalRooms() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    localRooms = raw ? JSON.parse(raw) : {};
  } catch {
    localRooms = {};
  }
}
loadLocalRooms();

// Re-export legacy firebase path
export { app };

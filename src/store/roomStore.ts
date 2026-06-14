import { create } from "zustand";
import type { HandSizeOption } from "../config/daxRules";
import { defaultHouseRules } from "../config/daxRules";
import { getStoredRoom, removeStoredRoom, saveRoom } from "../utils/roomStorage";

export interface RoomPlayer {
  id: string;
  username: string;
  avatarId: string;
  isHost: boolean;
  isReady: boolean;
  isBot?: boolean;
}

export interface RoomSettings {
  maxPlayers: number;
  handSize: HandSizeOption;
  daxCallEnabled: boolean;
  customRules: boolean;
  houseRules: ReturnType<typeof defaultHouseRules>;
}

export interface Room {
  code: string;
  hostId: string;
  players: RoomPlayer[];
  settings: RoomSettings;
  status: "waiting" | "starting" | "in_game";
}

interface RoomStore {
  currentRoom: Room | null;
  joinCode: string;
  createRoom: (hostId: string, hostName: string, settingsOverride?: Partial<RoomSettings>) => Room;
  joinRoomByCode: (code: string, playerId: string, username: string) => boolean;
  loadRoomByCode: (code: string) => boolean;
  leaveRoom: () => void;
  updateSettings: (settings: Partial<RoomSettings>) => void;
  toggleReady: (playerId: string) => void;
  setJoinCode: (code: string) => void;
  addBotPlayer: () => void;
  persistCurrentRoom: () => void;
}

const defaultSettings = (): RoomSettings => ({
  maxPlayers: 4,
  handSize: 7,
  daxCallEnabled: true,
  customRules: false,
  houseRules: defaultHouseRules(),
});

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const BOT_NAMES = ["NadiaK", "OmarPlays", "ZaraCards", "KhalidDAX", "LaylaM", "YusufG"];

export const useRoomStore = create<RoomStore>((set, get) => ({
  currentRoom: null,
  joinCode: "",

  persistCurrentRoom: () => {
    const room = get().currentRoom;
    if (room) saveRoom(room);
  },

  createRoom: (hostId, hostName, settingsOverride) => {
    const room: Room = {
      code: genCode(),
      hostId,
      status: "waiting",
      settings: { ...defaultSettings(), ...settingsOverride },
      players: [{
        id: hostId,
        username: hostName,
        avatarId: "avatar-1",
        isHost: true,
        isReady: true,
      }],
    };
    saveRoom(room);
    set({ currentRoom: room, joinCode: room.code });
    return room;
  },

  loadRoomByCode: (code) => {
    const stored = getStoredRoom(code);
    if (!stored) return false;
    set({ currentRoom: stored, joinCode: code });
    return true;
  },

  joinRoomByCode: (code, playerId, username) => {
    let room = get().currentRoom?.code === code ? get().currentRoom : getStoredRoom(code);
    if (!room) return false;

    if (room.players.length >= room.settings.maxPlayers) return false;
    if (room.players.some((p) => p.id === playerId)) {
      set({ currentRoom: room, joinCode: code });
      return true;
    }

    room = {
      ...room,
      players: [...room.players, {
        id: playerId,
        username,
        avatarId: `avatar-${(room.players.length % 8) + 1}`,
        isHost: false,
        isReady: false,
      }],
    };
    saveRoom(room);
    set({ currentRoom: room, joinCode: code });
    return true;
  },

  leaveRoom: () => {
    const room = get().currentRoom;
    const playerId = room?.players.find((p) => !p.isBot)?.id;
    if (room && playerId) {
      const remaining = room.players.filter((p) => p.id !== playerId);
      if (remaining.length === 0) {
        removeStoredRoom(room.code);
      } else {
        const nextHost = remaining[0];
        const updated: Room = {
          ...room,
          hostId: nextHost.id,
          players: remaining.map((p, i) => ({
            ...p,
            isHost: i === 0,
          })),
        };
        saveRoom(updated);
      }
    }
    set({ currentRoom: null });
  },

  setJoinCode: (code) => set({ joinCode: code }),

  updateSettings: (partial) => {
    const room = get().currentRoom;
    if (!room) return;
    const updated = { ...room, settings: { ...room.settings, ...partial } };
    saveRoom(updated);
    set({ currentRoom: updated });
  },

  toggleReady: (playerId) => {
    const room = get().currentRoom;
    if (!room) return;
    const updated: Room = {
      ...room,
      players: room.players.map((p) =>
        p.id === playerId ? { ...p, isReady: !p.isReady } : p
      ),
    };
    saveRoom(updated);
    set({ currentRoom: updated });
  },

  addBotPlayer: () => {
    const room = get().currentRoom;
    if (!room || room.players.length >= room.settings.maxPlayers) return;
    const botIndex = room.players.filter((p) => p.isBot).length;
    const updated: Room = {
      ...room,
      players: [...room.players, {
        id: `bot-${room.code}-${botIndex}`,
        username: BOT_NAMES[botIndex % BOT_NAMES.length],
        avatarId: `avatar-${(room.players.length % 8) + 1}`,
        isHost: false,
        isReady: true,
        isBot: true,
      }],
    };
    saveRoom(updated);
    set({ currentRoom: updated });
  },
}));

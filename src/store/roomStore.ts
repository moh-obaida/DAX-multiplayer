import { create } from "zustand";
import type { HandSizeOption } from "../config/daxRules";
import { defaultHouseRules } from "../config/daxRules";

export interface RoomPlayer {
  id: string;
  username: string;
  avatarId: string;
  isHost: boolean;
  isReady: boolean;
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
  createRoom: (hostId: string, hostName: string) => Room;
  joinRoom: (code: string, playerId: string, username: string) => boolean;
  leaveRoom: () => void;
  updateSettings: (settings: Partial<RoomSettings>) => void;
  toggleReady: (playerId: string) => void;
  setJoinCode: (code: string) => void;
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

export const useRoomStore = create<RoomStore>((set, get) => ({
  currentRoom: null,
  joinCode: "",

  createRoom: (hostId, hostName) => {
    const room: Room = {
      code: genCode(),
      hostId,
      status: "waiting",
      settings: defaultSettings(),
      players: [{
        id: hostId,
        username: hostName,
        avatarId: "avatar-1",
        isHost: true,
        isReady: true,
      }],
    };
    set({ currentRoom: room });
    return room;
  },

  joinRoom: (code, playerId, username) => {
    const room = get().currentRoom;
    if (!room || room.code !== code) return false;
    if (room.players.length >= room.settings.maxPlayers) return false;
    if (room.players.some((p) => p.id === playerId)) return true;
    set({
      currentRoom: {
        ...room,
        players: [...room.players, {
          id: playerId,
          username,
          avatarId: `avatar-${(room.players.length % 8) + 1}`,
          isHost: false,
          isReady: false,
        }],
      },
    });
    return true;
  },

  leaveRoom: () => set({ currentRoom: null }),
  setJoinCode: (code) => set({ joinCode: code }),

  updateSettings: (partial) => {
    const room = get().currentRoom;
    if (!room) return;
    set({ currentRoom: { ...room, settings: { ...room.settings, ...partial } } });
  },

  toggleReady: (playerId) => {
    const room = get().currentRoom;
    if (!room) return;
    set({
      currentRoom: {
        ...room,
        players: room.players.map((p) =>
          p.id === playerId ? { ...p, isReady: !p.isReady } : p
        ),
      },
    });
  },
}));

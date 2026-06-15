import type { Card, CardColor, GameState, Player } from "./game";

export type RoomStatus = "waiting" | "playing" | "ended";

export interface FirebasePlayer {
  id: string;
  name: string;
  color: CardColor;
  hand: Card[];
  role: "host" | "player" | "spectator";
  avatarId: string;
  isReady: boolean;
  afkStrikes: number;
  hasCalledUno: boolean;
  status: Player["status"];
}

export interface FirebaseGameState {
  currentPlayerIndex: number;
  discard: Card[];
  deck: Card[];
  playDirection: "clockwise" | "counterClockwise";
  pendingDraw: number;
  pendingWildPick: { playerId: string; cardId: string } | null;
  activeColor: CardColor | null;
  finishOrder: string[];
  winners: string[];
}

export interface FirebaseRoomSettings {
  plus4Stack: boolean;
  plus2Stack: boolean;
  afkRule: boolean;
  aiReplacement: boolean;
  handSize: number;
  maxPlayers: number;
  daxCallEnabled: boolean;
}

export interface FirebaseRoom {
  code: string;
  hostId: string;
  players: FirebasePlayer[];
  gameState: FirebaseGameState | null;
  settings: FirebaseRoomSettings;
  status: RoomStatus;
  messages: ChatMessage[];
  createdAt: number;
  lastActivity: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  type: "emote" | "phrase";
  content: string;
  timestamp: number;
}

export interface RoomSnapshot {
  room: FirebaseRoom;
  fullGame: GameState | null;
}

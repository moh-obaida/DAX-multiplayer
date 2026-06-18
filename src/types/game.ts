export type CardColor = "red" | "yellow" | "green" | "blue";
export type CardType = "number" | "skip" | "reverse" | "draw2" | "wild" | "wild_draw4";

export interface Card {
  id: string;
  color: CardColor;
  type: CardType;
  value?: number;
}

export interface Player {
  id: string;
  name: string;
  avatarId: string;
  handSize: number;
  hand: Card[];
  status: "active" | "away" | "disconnected" | "finished" | "spectator";
  isCurrentTurn: boolean;
  hasCalledDax: boolean;
  hasCalledUno: boolean;
  afkStrikes: number;
  wins: number;
  losses: number;
  isBot?: boolean;
  isHost?: boolean;
}

export interface GameSettings {
  minPlayers: 2;
  maxPlayers: 8;
  handSize: 7 | 10 | 14 | 21;
  houseRules: {
    plus2Stack: boolean;
    plus4Stack: boolean;
    cardChallengeEnabled: boolean;
    daxCallEnabled: boolean;
    afkRule: boolean;
    aiReplacement: boolean;
  };
  turnTimer: 30;
  autoDrawTimeout: 5;
}

export interface PendingWildPick {
  playerId: string;
  cardId: string;
  deadline: number;
}

export interface GameMessage {
  id: string;
  playerId: string;
  playerName: string;
  type: "emote" | "phrase" | "system";
  content: string;
  timestamp: number;
}

export interface GameState {
  id: string;
  roomCode: string;
  players: Player[];
  deck: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  playDirection: "clockwise" | "counterClockwise";
  gameStatus: "waiting" | "playing" | "finished";
  winners: string[];
  finishOrder: string[];
  hostId: string;
  createdAt: number;
  settings: GameSettings;
  turnTimer: number;
  pendingDraw: number;
  activeColor: CardColor | null;
  pendingWildPick: PendingWildPick | null;
  drawStackType: "draw2" | "wild_draw4" | null;
  messages: GameMessage[];
  spectatorCount: number;
}

export interface RoomConfig {
  code: string;
  hostId: string;
  maxPlayers: number;
  handSize: number;
  settings: GameSettings["houseRules"];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatarId: string;
  stats: {
    totalGames: number;
    wins: number;
    losses: number;
    currentStreak: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface ScoreEntry {
  playerId: string;
  playerName: string;
  points: number;
  cardsRemaining: number;
  placement: number;
}

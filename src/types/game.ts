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
  status: "active" | "away" | "disconnected";
  isCurrentTurn: boolean;
  wins: number;
  losses: number;
}

export interface GameState {
  id: string;
  players: Player[];
  deck: Card[];
  discardPile: Card[];
  currentPlayerIndex: number;
  playDirection: "clockwise" | "counterClockwise";
  gameStatus: "waiting" | "playing" | "finished";
  winners: string[];
  hostId: string;
  createdAt: number;
  settings: GameSettings;
  turnTimer: number;
}

export interface GameSettings {
  minPlayers: 2;
  maxPlayers: 8;
  handSize: 7 | 10 | 14 | 21;
  houseRules: {
    stackingEnabled: boolean;
    forcingPlayEnabled: boolean;
    cardChallengeEnabled: boolean;
  };
  turnTimer: 30;
  autoDrawTimeout: 5;
  difficulty: "easy" | "normal" | "veteran" | "heroic";
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

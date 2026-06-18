import type { CardColor } from "../types/game";
import type { EmoteOption, PhraseOption } from "../types/ui";
import { DAX_RULES } from "../config/daxRules";

export const TURN_TIMER_SECONDS = DAX_RULES.defaults.turnTimerSeconds;
export const WILD_PICK_SECONDS = 15;
export const AFK_KICK_STRIKES = 3;
export const ROOM_INACTIVITY_MS = 15 * 60 * 1000;
export const MIN_PLAYERS = DAX_RULES.defaults.minPlayers;
export const MAX_PLAYERS = DAX_RULES.defaults.maxPlayers;

export const CARD_WIDTH = 96;
export const CARD_HEIGHT = 144;
export const DISCARD_SIZE = 120;

export const SUIT_COLORS: Record<CardColor, string> = {
  red: "#F44336",
  yellow: "#FFD54F",
  green: "#4CAF50",
  blue: "#2196F3",
};

export const DESIGN_TOKENS = {
  emerald: "#0f2818",
  board: "#1a3a2e",
  gold: "#d4af37",
  ivory: "#f5f1e8",
  black: "#000000",
} as const;

export const EMOTES: EmoteOption[] = [
  { id: "wave", emoji: "👋", label: "Wave" },
  { id: "laugh", emoji: "😂", label: "Laugh" },
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "clap", emoji: "👏", label: "Clap" },
  { id: "oops", emoji: "😤", label: "Frustrated" },
  { id: "party", emoji: "🎉", label: "Celebrate" },
  { id: "strong", emoji: "💪", label: "Strong" },
  { id: "joker", emoji: "🃏", label: "Joker" },
];

export const PHRASES: PhraseOption[] = [
  { id: "nice", text: "Nice play!" },
  { id: "oops", text: "Oops!" },
  { id: "gg", text: "GG!" },
  { id: "hurry", text: "Hurry up!" },
  { id: "lucky", text: "Lucky draw!" },
  { id: "uno", text: "Don't forget UNO!" },
];

export const SCORING = {
  number: (value: number) => value,
  action: 20,
  wild: 50,
} as const;

export const DEFAULT_ROOM_SETTINGS = {
  plus4Stack: false,
  plus2Stack: false,
  afkRule: true,
  aiReplacement: false,
  handSize: 7,
  maxPlayers: MAX_PLAYERS,
  daxCallEnabled: true,
} as const;

export function generateRoomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

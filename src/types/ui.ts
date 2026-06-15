import type { CardColor } from "./game";

export type PlayerSeatPosition = "bottom" | "top" | "left" | "right" | "top-left" | "top-right";

export interface TimerState {
  remaining: number;
  total: number;
  phase: "green" | "yellow" | "red";
  isFlashing: boolean;
}

export interface WildPickerState {
  isOpen: boolean;
  playerId: string;
  cardId: string;
  deadline: number;
}

export interface EmoteOption {
  id: string;
  emoji: string;
  label: string;
}

export interface PhraseOption {
  id: string;
  text: string;
}

export interface CardSizeMap {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}

export const COLOR_LABELS: Record<CardColor, string> = {
  red: "Red",
  yellow: "Yellow",
  green: "Green",
  blue: "Blue",
};

export const COLOR_PATTERNS: Record<CardColor, string> = {
  red: "diagonal-lines",
  yellow: "dots",
  green: "crosshatch",
  blue: "horizontal-lines",
};

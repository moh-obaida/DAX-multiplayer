import type { CardColor, CardType } from "../types/game";

/** DAX is built on familiar UNO-style card mechanics with our own house rules. */
export const DAX_RULES = {
  name: "DAX",
  tagline: "UNO-inspired. DAX rules.",
  callLabel: "DAX!",

  deck: {
    colors: ["red", "yellow", "green", "blue"] as CardColor[],
    numberRange: [0, 9] as const,
    actionCards: ["skip", "reverse", "draw2"] as CardType[],
    wildCards: ["wild", "wild_draw4"] as CardType[],
    copiesPerAction: 2,
    copiesPerWild: 4,
  },

  defaults: {
    handSize: 7 as const,
    minPlayers: 2,
    maxPlayers: 8,
    turnTimerSeconds: 30,
    autoDrawOnTimeout: true,
    daxCallEnabled: true,
    daxCallPenaltyCards: 2,
  },

  /** How many players must finish before the winner is decided (by finish place). */
  winTiers: [
    { minPlayers: 2, maxPlayers: 4, winningPlace: 1, label: "First to empty their hand wins" },
    { minPlayers: 5, maxPlayers: 5, winningPlace: 2, label: "Second player to finish wins" },
    { minPlayers: 6, maxPlayers: 8, winningPlace: 3, label: "Third player to finish wins" },
  ],

  scoring: {
    number: "face value",
    action: 20,
    wild: 50,
  },

  houseRules: {
    stackingEnabled: {
      default: false,
      description: "Allow stacking Draw +2 and Wild +4 onto existing draw penalties.",
    },
    forcingPlayEnabled: {
      default: true,
      description: "If you have a valid card, you must play it — you cannot draw voluntarily.",
    },
    cardChallengeEnabled: {
      default: false,
      description: "Challenge a Wild +4: if the player had a matching color, they draw 4 instead of you.",
    },
    daxCallEnabled: {
      default: true,
      description: "Call DAX! when one card remains or draw penalty cards.",
    },
  },

  /** Rules DAX shares with classic UNO */
  sharedWithUno: [
    "Four colors with number cards 0–9",
    "Skip, Reverse, and Draw +2 action cards",
    "Wild and Wild +4 cards",
    "Match by color, number, or action symbol",
    "Draw one card when you cannot play (unless forced-play is on)",
  ],

  /** Rules that are uniquely DAX */
  daxOnly: [
    "Win tier by table size (1st / 2nd / 3rd finisher)",
    "30-second turn timer with auto-draw on timeout",
    "DAX! call with configurable penalty",
    "Hand sizes up to 21 cards in private rooms",
    "Up to 8 players with finish-order scoring",
    "Optional draw stacking and Wild +4 challenges",
    "Halal, ad-free, no gambling — stats and fun only",
  ],
} as const;

export type HandSizeOption = 7 | 10 | 14 | 21;

export interface DaxHouseRules {
  stackingEnabled: boolean;
  forcingPlayEnabled: boolean;
  cardChallengeEnabled: boolean;
  daxCallEnabled: boolean;
}

export function defaultHouseRules(): DaxHouseRules {
  return {
    stackingEnabled: DAX_RULES.houseRules.stackingEnabled.default,
    forcingPlayEnabled: DAX_RULES.houseRules.forcingPlayEnabled.default,
    cardChallengeEnabled: DAX_RULES.houseRules.cardChallengeEnabled.default,
    daxCallEnabled: DAX_RULES.houseRules.daxCallEnabled.default,
  };
}

/** Returns 1-based finish place that wins (1 = first finisher, 2 = second, etc.). */
export function getWinningFinishPlace(playerCount: number): number {
  const tier = DAX_RULES.winTiers.find(
    (t) => playerCount >= t.minPlayers && playerCount <= t.maxPlayers
  );
  return tier?.winningPlace ?? 1;
}

/** Zero-based index into finishOrder for the winner. */
export function getWinnerIndex(playerCount: number): number {
  return getWinningFinishPlace(playerCount) - 1;
}

export function isValidHandSize(size: number): size is HandSizeOption {
  return [7, 10, 14, 21].includes(size);
}

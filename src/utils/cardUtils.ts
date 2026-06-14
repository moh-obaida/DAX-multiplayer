import type { Card, CardColor } from "../types/game";

export const canPlayCard = (card: Card, topCard: Card): boolean => {
  if (card.type === "wild" || card.type === "wild_draw4") return true;
  if (card.color === topCard.color) return true;
  if (card.type === "number" && topCard.type === "number" && card.value === topCard.value) return true;
  if (card.type !== "number" && card.type === topCard.type) return true;
  return false;
};

export const playerHasPlayableCard = (hand: Card[], topCard: Card): boolean =>
  hand.some((c) => canPlayCard(c, topCard));

export const generateDeck = (): Card[] => {
  const colors: CardColor[] = ["red", "yellow", "green", "blue"];
  const deck: Card[] = [];
  let id = 0;

  colors.forEach((color) => {
    for (let i = 0; i <= 9; i++) {
      deck.push({ id: `card-${id++}`, color, type: "number", value: i });
      if (i > 0) {
        deck.push({ id: `card-${id++}`, color, type: "number", value: i });
      }
    }
  });

  colors.forEach((color) => {
    for (let i = 0; i < 2; i++) {
      deck.push({ id: `card-${id++}`, color, type: "skip" });
      deck.push({ id: `card-${id++}`, color, type: "reverse" });
      deck.push({ id: `card-${id++}`, color, type: "draw2" });
    }
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ id: `card-${id++}`, color: "red", type: "wild" });
    deck.push({ id: `card-${id++}`, color: "red", type: "wild_draw4" });
  }

  return shuffle(deck);
};

export const shuffle = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealHand = (deck: Card[], handSize: number): { hand: Card[]; remaining: Card[] } => ({
  hand: deck.slice(0, handSize),
  remaining: deck.slice(handSize),
});

export const getNextPlayer = (
  currentIndex: number,
  totalPlayers: number,
  direction: "clockwise" | "counterClockwise",
  skipFinished = true,
  players?: { status: string }[]
): number => {
  let idx = currentIndex;
  for (let step = 0; step < totalPlayers; step++) {
    idx = direction === "clockwise" ? (idx + 1) % totalPlayers : (idx - 1 + totalPlayers) % totalPlayers;
    if (!skipFinished || !players || players[idx].status !== "finished") return idx;
  }
  return idx;
};

export const calculateCardPoints = (card: Card): number => {
  if (card.type === "number") return card.value || 0;
  if (card.type === "skip" || card.type === "reverse" || card.type === "draw2") return 20;
  if (card.type === "wild" || card.type === "wild_draw4") return 50;
  return 0;
};

export const getCardDisplayText = (card: Card): string => {
  if (card.type === "number") return card.value?.toString() || "0";
  if (card.type === "skip") return "SKIP";
  if (card.type === "reverse") return "REV";
  if (card.type === "draw2") return "+2";
  if (card.type === "wild") return "WILD";
  if (card.type === "wild_draw4") return "+4";
  return "";
};

/** DAX rule: opening discard cannot be Wild +4 — reshuffle until valid. */
export const drawOpeningDiscard = (deck: Card[]): { topCard: Card; remaining: Card[] } => {
  let pool = [...deck];
  while (pool.length > 0) {
    const [top, ...rest] = pool;
    if (top.type !== "wild_draw4") return { topCard: top, remaining: rest };
    pool = shuffle([top, ...rest]);
  }
  throw new Error("Deck exhausted while drawing opening card");
};

export const drawFromDeck = (game: { deck: Card[]; discardPile: Card[] }, count: number): { drawn: Card[]; deck: Card[] } => {
  let deck = [...game.deck];
  const drawn: Card[] = [];
  while (drawn.length < count) {
    if (deck.length === 0) {
      if (game.discardPile.length <= 1) break;
      deck = shuffle(game.discardPile.slice(0, -1));
    }
    if (deck.length === 0) break;
    drawn.push(deck[0]);
    deck = deck.slice(1);
  }
  return { drawn, deck };
};

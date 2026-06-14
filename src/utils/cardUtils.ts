import type { Card, CardColor } from "../types/game";

export const canPlayCard = (card: Card, topCard: Card): boolean => {
  if (card.type === "wild" || card.type === "wild_draw4") return true;
  if (card.color === topCard.color) return true;
  if (card.type === "number" && topCard.type === "number" && card.value === topCard.value) return true;
  return false;
};

export const generateDeck = (): Card[] => {
  const colors: CardColor[] = ["red", "yellow", "green", "blue"];
  const deck: Card[] = [];
  let id = 0;

  colors.forEach((color) => {
    for (let i = 0; i <= 9; i++) {
      deck.push({
        id: `card-${id++}`,
        color,
        type: "number",
        value: i,
      });
      if (i > 0) {
        deck.push({
          id: `card-${id++}`,
          color,
          type: "number",
          value: i,
        });
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
    deck.push({ id: `card-${id++}`, color: "red" as CardColor, type: "wild" });
    deck.push({ id: `card-${id++}`, color: "red" as CardColor, type: "wild_draw4" });
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

export const dealHand = (deck: Card[], handSize: number): { hand: Card[]; remaining: Card[] } => {
  return {
    hand: deck.slice(0, handSize),
    remaining: deck.slice(handSize),
  };
};

export const getNextPlayer = (currentIndex: number, totalPlayers: number, direction: "clockwise" | "counterClockwise"): number => {
  if (direction === "clockwise") {
    return (currentIndex + 1) % totalPlayers;
  } else {
    return (currentIndex - 1 + totalPlayers) % totalPlayers;
  }
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

import type { Card, GameState } from "../types/game";
import { drawCard, isValidPlay, playCard } from "./gameLogic";

const COLORS: Card["color"][] = ["red", "yellow", "green", "blue"];

export function findPlayableCard(hand: Card[], topCard: Card): Card | null {
  return hand.find((c) => isValidPlay(c, topCard)) ?? null;
}

export function runBotTurn(game: GameState): GameState {
  const botIndex = game.currentPlayerIndex;
  const bot = game.players[botIndex];
  if (!bot?.isBot || !bot.isCurrentTurn) return game;

  const topCard = game.discardPile[game.discardPile.length - 1];
  const playable = findPlayableCard(bot.hand, topCard);

  if (playable) {
    const chosenColor = playable.type === "wild" || playable.type === "wild_draw4"
      ? COLORS[Math.floor(Math.random() * COLORS.length)]
      : undefined;
    return playCard(game, bot.id, playable.id, chosenColor);
  }

  return drawCard(game, bot.id);
}

import type { CardColor, GameState } from "../types/game";
import { isValidPlay } from "./gameLogic";

export type PlayValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

export function validatePlayAction(
  game: GameState,
  playerId: string,
  cardId: string,
  chosenColor?: CardColor
): PlayValidationResult {
  if (game.gameStatus !== "playing") {
    return { ok: false, reason: "Game is not in progress" };
  }

  const playerIndex = game.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) {
    return { ok: false, reason: "Player not in game" };
  }

  const player = game.players[playerIndex];
  if (!player.isCurrentTurn) {
    return { ok: false, reason: "Not your turn" };
  }

  if (player.status !== "active") {
    return { ok: false, reason: "Player is not active" };
  }

  const card = player.hand.find((c) => c.id === cardId);
  if (!card) {
    return { ok: false, reason: "Card not in hand" };
  }

  if (card.type === "wild" || card.type === "wild_draw4") {
    if (!chosenColor && !game.pendingWildPick) {
      return { ok: true };
    }
    if (!chosenColor && game.pendingWildPick?.cardId !== cardId) {
      return { ok: false, reason: "Choose a color for wild card" };
    }
    return { ok: true };
  }

  const topCard = game.discardPile[game.discardPile.length - 1];
  if (!isValidPlay(card, topCard, game.activeColor)) {
    return { ok: false, reason: "Illegal play" };
  }

  return { ok: true };
}

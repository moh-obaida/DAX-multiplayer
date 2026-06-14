import type { GameState, Player, GameSettings } from "../types/game";
import { generateDeck, dealHand, getNextPlayer } from "./cardUtils";
import { defaultHouseRules } from "../config/daxRules";
import { getWinnerIndex } from "../config/daxRules";

import type { Card } from "../types/game";

export function isValidPlay(card: Card, topCard: Card): boolean {
  if (card.type === "wild" || card.type === "wild_draw4") return true;
  const sameColor = card.color === topCard.color;
  const sameValue = card.type === "number" && topCard.type === "number" && card.value === topCard.value;
  const sameAction = card.type !== "number" && card.type === topCard.type;
  return sameColor || sameValue || sameAction;
}

export const initializeGame = (players: Player[], hostId: string, handSize: number = 7): GameState => {
  let deck = generateDeck();

  // First discard cannot be Wild +4
  let topIdx = deck.findIndex((c) => c.type !== "wild_draw4");
  if (topIdx === -1) topIdx = 0;

  const initializedPlayers = players.map((p, i) => {
    const { hand, remaining } = dealHand(deck, handSize);
    deck = remaining;
    return {
      ...p,
      hand,
      handSize,
      isCurrentTurn: i === 0,
      hasCalledDax: false,
      status: "active" as const,
    };
  });

  const topCard = deck[topIdx];
  const discardRest = deck.filter((_, i) => i !== topIdx);

  const houseRules = defaultHouseRules();

  return {
    id: `game-${Date.now()}`,
    players: initializedPlayers,
    deck: discardRest,
    discardPile: [topCard],
    currentPlayerIndex: 0,
    playDirection: "clockwise",
    gameStatus: "playing",
    winners: [],
    finishOrder: [],
    hostId,
    createdAt: Date.now(),
    pendingDraw: 0,
    settings: {
      minPlayers: 2,
      maxPlayers: 8,
      handSize: handSize as GameSettings["handSize"],
      houseRules,
      turnTimer: 30,
      autoDrawTimeout: 5,
      difficulty: "normal",
    },
    turnTimer: 30,
  };
};

function applyFinish(game: GameState, playerId: string, playerIndex: number, newPlayers: Player[]): GameState {
  const finishOrder = [...game.finishOrder, playerId];
  newPlayers[playerIndex] = { ...newPlayers[playerIndex], status: "finished", hand: [] };
  const winIdx = getWinnerIndex(game.players.length);
  if (finishOrder.length > winIdx) {
    const winnerId = finishOrder[winIdx];
    return { ...game, players: newPlayers, finishOrder, gameStatus: "finished", winners: [winnerId] };
  }
  const nextActive = newPlayers.findIndex((p, i) => p.status === "active" && i !== playerIndex);
  if (nextActive >= 0) {
    newPlayers.forEach((p, i) => { p.isCurrentTurn = i === nextActive; });
    return { ...game, players: newPlayers, finishOrder, currentPlayerIndex: nextActive, turnTimer: 30 };
  }
  return { ...game, players: newPlayers, finishOrder, gameStatus: "finished", winners: [finishOrder[winIdx] || playerId] };
}

export const playCard = (game: GameState, playerId: string, cardId: string, chosenColor?: string): GameState => {
  const playerIndex = game.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1 || !game.players[playerIndex].isCurrentTurn) return game;

  const player = game.players[playerIndex];
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return game;

  const card = player.hand[cardIndex];
  const topCard = game.discardPile[game.discardPile.length - 1];

  if (card.type !== "wild" && card.type !== "wild_draw4") {
    if (!isValidPlay(card, topCard)) return game;
  }

  const newPlayers = game.players.map((p) => ({ ...p, isCurrentTurn: false }));
  const newHand = player.hand.filter((_, i) => i !== cardIndex);
  newPlayers[playerIndex] = { ...player, hand: newHand, isCurrentTurn: false };

  const newDiscardPile = [...game.discardPile, { ...card, color: (chosenColor || card.color) as typeof card.color }];

  if (newHand.length === 0) {
    return applyFinish(game, playerId, playerIndex, newPlayers);
  }

  let nextPlayerIndex = getNextPlayer(game.currentPlayerIndex, game.players.length, game.playDirection);

  if (card.type === "skip") {
    nextPlayerIndex = getNextPlayer(nextPlayerIndex, game.players.length, game.playDirection);
  } else if (card.type === "reverse") {
    if (game.players.length === 2) {
      nextPlayerIndex = getNextPlayer(nextPlayerIndex, game.players.length, game.playDirection);
    } else {
      const newDirection = game.playDirection === "clockwise" ? "counterClockwise" : "clockwise";
      newPlayers.forEach((p, i) => { p.isCurrentTurn = i === nextPlayerIndex; });
      return { ...game, players: newPlayers, discardPile: newDiscardPile, currentPlayerIndex: nextPlayerIndex, playDirection: newDirection, turnTimer: 30 };
    }
  } else if (card.type === "draw2") {
    const drawCount = Math.min(2, game.deck.length);
    newPlayers[nextPlayerIndex].hand.push(...game.deck.slice(0, drawCount));
    const remainingDeck = game.deck.slice(drawCount);
    nextPlayerIndex = getNextPlayer(nextPlayerIndex, game.players.length, game.playDirection);
    newPlayers.forEach((p, i) => { p.isCurrentTurn = i === nextPlayerIndex; });
    return { ...game, players: newPlayers, deck: remainingDeck, discardPile: newDiscardPile, currentPlayerIndex: nextPlayerIndex, turnTimer: 30 };
  }

  newPlayers.forEach((p, i) => { p.isCurrentTurn = i === nextPlayerIndex; });
  return { ...game, players: newPlayers, discardPile: newDiscardPile, currentPlayerIndex: nextPlayerIndex, turnTimer: 30 };
};

export const drawCard = (game: GameState, playerId: string): GameState => {
  const playerIndex = game.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1 || !game.players[playerIndex].isCurrentTurn) return game;

  let deck = [...game.deck];
  if (deck.length === 0) deck = game.discardPile.slice(0, -1);
  if (deck.length === 0) return game;

  const drawnCard = deck[0];
  const newPlayers = game.players.map((p) => ({ ...p, isCurrentTurn: false }));
  newPlayers[playerIndex].hand.push(drawnCard);

  const nextPlayerIndex = getNextPlayer(playerIndex, game.players.length, game.playDirection);
  newPlayers[nextPlayerIndex].isCurrentTurn = true;

  return { ...game, players: newPlayers, deck: deck.slice(1), currentPlayerIndex: nextPlayerIndex, turnTimer: 30 };
};

export const callDax = (game: GameState, playerId: string): GameState => {
  const idx = game.players.findIndex((p) => p.id === playerId);
  if (idx === -1) return game;
  const newPlayers = [...game.players];
  newPlayers[idx] = { ...newPlayers[idx], hasCalledDax: true };
  return { ...game, players: newPlayers };
};

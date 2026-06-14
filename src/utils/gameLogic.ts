import type { GameState, Player } from "../types/game";
import { generateDeck, dealHand, getNextPlayer } from "./cardUtils";

export const initializeGame = (players: Player[], hostId: string, handSize: number = 7): GameState => {
  const deck = generateDeck();
  const { hand: firstHand, remaining } = dealHand(deck, handSize);
  const [topCard, ...discardRest] = remaining;

  const initializedPlayers = players.map((p, i) => ({
    ...p,
    hand: i === 0 ? firstHand : [],
    isCurrentTurn: i === 0,
  }));

  return {
    id: `game-${Date.now()}`,
    players: initializedPlayers,
    deck: discardRest,
    discardPile: [topCard],
    currentPlayerIndex: 0,
    playDirection: "clockwise",
    gameStatus: "playing",
    winners: [],
    hostId,
    createdAt: Date.now(),
    settings: {
      minPlayers: 2,
      maxPlayers: 8,
      handSize: handSize as 7 | 10 | 14 | 21,
      houseRules: {
        stackingEnabled: false,
        forcingPlayEnabled: true,
        cardChallengeEnabled: false,
      },
      turnTimer: 30,
      autoDrawTimeout: 5,
      difficulty: "normal",
    },
    turnTimer: 30,
  };
};

export const playCard = (game: GameState, playerId: string, cardId: string, chosenColor?: string): GameState => {
  const playerIndex = game.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1 || !game.players[playerIndex].isCurrentTurn) return game;

  const player = game.players[playerIndex];
  const cardIndex = player.hand.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return game;

  const card = player.hand[cardIndex];
  const topCard = game.discardPile[game.discardPile.length - 1];

  if (card.type !== "wild" && card.type !== "wild_draw4") {
    if (card.color !== topCard.color && card.value !== topCard.value) {
      return game;
    }
  }

  const newPlayers = [...game.players];
  const newHand = player.hand.filter((_, i) => i !== cardIndex);
  newPlayers[playerIndex] = { ...player, hand: newHand };

  const newDiscardPile = [...game.discardPile, { ...card, color: (chosenColor || card.color) as typeof card.color }];

  if (newHand.length === 0) {
    newPlayers[playerIndex].wins++;
    return {
      ...game,
      players: newPlayers,
      discardPile: newDiscardPile,
      gameStatus: "finished",
      winners: [playerId],
    };
  }

  let nextPlayerIndex = getNextPlayer(game.currentPlayerIndex, game.players.length, game.playDirection);

  if (card.type === "skip") {
    nextPlayerIndex = getNextPlayer(nextPlayerIndex, game.players.length, game.playDirection);
  } else if (card.type === "reverse") {
    if (game.players.length === 2) {
      nextPlayerIndex = getNextPlayer(nextPlayerIndex, game.players.length, game.playDirection);
    } else {
      const newDirection = game.playDirection === "clockwise" ? "counterClockwise" : "clockwise";
      return {
        ...game,
        players: newPlayers,
        discardPile: newDiscardPile,
        currentPlayerIndex: nextPlayerIndex,
        playDirection: newDirection,
        turnTimer: 30,
      };
    }
  } else if (card.type === "draw2") {
    const drawCount = Math.min(2, game.deck.length);
    const drawnCards = game.deck.slice(0, drawCount);
    const remainingDeck = game.deck.slice(drawCount);
    newPlayers[nextPlayerIndex].hand.push(...drawnCards);
    nextPlayerIndex = getNextPlayer(nextPlayerIndex, game.players.length, game.playDirection);
    return {
      ...game,
      players: newPlayers,
      deck: remainingDeck,
      discardPile: newDiscardPile,
      currentPlayerIndex: nextPlayerIndex,
      turnTimer: 30,
    };
  }

  return {
    ...game,
    players: newPlayers,
    discardPile: newDiscardPile,
    currentPlayerIndex: nextPlayerIndex,
    turnTimer: 30,
  };
};

export const drawCard = (game: GameState, playerId: string): GameState => {
  const playerIndex = game.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1 || !game.players[playerIndex].isCurrentTurn) return game;

  if (game.deck.length === 0) {
    const newDeck = game.discardPile.slice(0, -1);
    return {
      ...game,
      deck: newDeck,
    };
  }

  const drawnCard = game.deck[0];
  const newPlayers = [...game.players];
  newPlayers[playerIndex].hand.push(drawnCard);
  newPlayers[playerIndex].isCurrentTurn = false;

  const nextPlayerIndex = getNextPlayer(playerIndex, game.players.length, game.playDirection);
  newPlayers[nextPlayerIndex].isCurrentTurn = true;

  return {
    ...game,
    players: newPlayers,
    deck: game.deck.slice(1),
    currentPlayerIndex: nextPlayerIndex,
    turnTimer: 30,
  };
};

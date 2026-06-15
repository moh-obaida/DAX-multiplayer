import type {
  Card,
  CardColor,
  GameState,
  GameSettings,
  Player,
  ScoreEntry,
} from "../types/game";
import type { FirebaseRoom, FirebaseGameState } from "../types/firebase";
import { DEFAULT_ROOM_SETTINGS, SCORING, TURN_TIMER_SECONDS, WILD_PICK_SECONDS } from "./constants";

export function isValidPlay(card: Card, topCard: Card, activeColor: CardColor | null): boolean {
  if (card.type === "wild" || card.type === "wild_draw4") return true;
  const effectiveColor = activeColor ?? topCard.color;
  if (card.color === effectiveColor) return true;
  if (card.type === "number" && topCard.type === "number" && card.value === topCard.value) return true;
  if (card.type !== "number" && card.type === topCard.type) return true;
  return false;
}

function generateDeck(): Card[] {
  const colors: CardColor[] = ["red", "yellow", "green", "blue"];
  const deck: Card[] = [];
  let id = 0;

  colors.forEach((color) => {
    for (let i = 0; i <= 9; i++) {
      deck.push({ id: `card-${id++}`, color, type: "number", value: i });
      if (i > 0) deck.push({ id: `card-${id++}`, color, type: "number", value: i });
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
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function dealHand(deck: Card[], handSize: number): { hand: Card[]; remaining: Card[] } {
  return { hand: deck.slice(0, handSize), remaining: deck.slice(handSize) };
}

export function getNextPlayer(
  currentIndex: number,
  totalPlayers: number,
  direction: "clockwise" | "counterClockwise",
  players?: Player[]
): number {
  let idx = currentIndex;
  for (let step = 0; step < totalPlayers; step++) {
    idx = direction === "clockwise" ? (idx + 1) % totalPlayers : (idx - 1 + totalPlayers) % totalPlayers;
    if (!players || players[idx].status === "active") return idx;
  }
  return idx;
}

function drawFromDeck(game: GameState, count: number): { drawn: Card[]; deck: Card[] } {
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
}

function defaultSettings(handSize: number): GameSettings {
  return {
    minPlayers: 2,
    maxPlayers: 4,
    handSize: handSize as GameSettings["handSize"],
    houseRules: {
      plus2Stack: DEFAULT_ROOM_SETTINGS.plus2Stack,
      plus4Stack: DEFAULT_ROOM_SETTINGS.plus4Stack,
      cardChallengeEnabled: false,
      daxCallEnabled: DEFAULT_ROOM_SETTINGS.daxCallEnabled,
      afkRule: DEFAULT_ROOM_SETTINGS.afkRule,
      aiReplacement: DEFAULT_ROOM_SETTINGS.aiReplacement,
    },
    turnTimer: TURN_TIMER_SECONDS,
    autoDrawTimeout: 5,
  };
}

export const initializeGame = (
  players: Player[],
  hostId: string,
  handSize: number = 7,
  roomCode: string = ""
): GameState => {
  let deck = generateDeck();
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
      hasCalledUno: false,
      afkStrikes: 0,
      status: "active" as const,
    };
  });

  const topCard = deck[topIdx];
  const discardRest = deck.filter((_, i) => i !== topIdx);

  return {
    id: `game-${Date.now()}`,
    roomCode,
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
    activeColor: topCard.type === "wild" || topCard.type === "wild_draw4" ? null : topCard.color,
    pendingWildPick: null,
    drawStackType: null,
    messages: [],
    spectatorCount: 0,
    settings: defaultSettings(handSize),
    turnTimer: TURN_TIMER_SECONDS,
  };
};

function applyFinish(game: GameState, playerId: string, playerIndex: number, newPlayers: Player[]): GameState {
  const finishOrder = [...game.finishOrder, playerId];
  newPlayers[playerIndex] = { ...newPlayers[playerIndex], status: "finished", hand: [] };

  const activeCount = newPlayers.filter((p) => p.status === "active").length;
  if (activeCount <= 1 || finishOrder.length >= Math.min(game.players.length, 2)) {
    const winnerId = finishOrder[0];
    return {
      ...game,
      players: newPlayers,
      finishOrder,
      gameStatus: "finished",
      winners: [winnerId],
      pendingWildPick: null,
    };
  }

  const nextActive = getNextPlayer(playerIndex, game.players.length, game.playDirection, newPlayers);
  newPlayers.forEach((p, i) => { p.isCurrentTurn = i === nextActive; });
  return {
    ...game,
    players: newPlayers,
    finishOrder,
    currentPlayerIndex: nextActive,
    turnTimer: TURN_TIMER_SECONDS,
    pendingWildPick: null,
  };
}

function applyDrawPenalty(game: GameState, targetIndex: number, count: number): GameState {
  const { drawn, deck } = drawFromDeck(game, count);
  const newPlayers = game.players.map((p) => ({ ...p }));
  newPlayers[targetIndex] = {
    ...newPlayers[targetIndex],
    hand: [...newPlayers[targetIndex].hand, ...drawn],
    hasCalledDax: false,
    hasCalledUno: false,
  };
  return { ...game, players: newPlayers, deck, pendingDraw: 0, drawStackType: null };
}

export const playCard = (
  game: GameState,
  playerId: string,
  cardId: string,
  chosenColor?: CardColor
): GameState => {
  const playerIndex = game.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1 || !game.players[playerIndex].isCurrentTurn) return game;

  const player = game.players[playerIndex];
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return game;

  const card = player.hand[cardIndex];
  const topCard = game.discardPile[game.discardPile.length - 1];

  if (card.type === "wild" || card.type === "wild_draw4") {
    if (!chosenColor && !game.pendingWildPick) {
      return {
        ...game,
        pendingWildPick: {
          playerId,
          cardId,
          deadline: Date.now() + WILD_PICK_SECONDS * 1000,
        },
      };
    }
  } else if (!isValidPlay(card, topCard, game.activeColor)) {
    return game;
  }

  const resolvedColor = chosenColor ?? (card.type === "wild" || card.type === "wild_draw4" ? undefined : card.color);
  if ((card.type === "wild" || card.type === "wild_draw4") && !resolvedColor) return game;

  const newPlayers = game.players.map((p) => ({ ...p, isCurrentTurn: false }));
  const newHand = player.hand.filter((_, i) => i !== cardIndex);
  newPlayers[playerIndex] = {
    ...player,
    hand: newHand,
    isCurrentTurn: false,
    hasCalledDax: newHand.length === 1 ? player.hasCalledDax : false,
    hasCalledUno: newHand.length === 1 ? player.hasCalledUno : false,
  };

  const playedCard: Card = {
    ...card,
    color: resolvedColor ?? card.color,
  };
  const newDiscardPile = [...game.discardPile, playedCard];
  let nextState: GameState = {
    ...game,
    players: newPlayers,
    discardPile: newDiscardPile,
    activeColor: resolvedColor ?? game.activeColor,
    pendingWildPick: null,
    turnTimer: TURN_TIMER_SECONDS,
  };

  if (newHand.length === 0) {
    return applyFinish(nextState, playerId, playerIndex, newPlayers);
  }

  let nextIndex = getNextPlayer(playerIndex, game.players.length, game.playDirection, newPlayers);
  let direction = game.playDirection;
  let pendingDraw = game.pendingDraw;
  let drawStackType = game.drawStackType;

  if (card.type === "skip") {
    nextIndex = getNextPlayer(nextIndex, game.players.length, direction, newPlayers);
  } else if (card.type === "reverse") {
    if (game.players.length === 2) {
      nextIndex = getNextPlayer(nextIndex, game.players.length, direction, newPlayers);
    } else {
      direction = direction === "clockwise" ? "counterClockwise" : "clockwise";
    }
  } else if (card.type === "draw2") {
    if (game.settings.houseRules.plus2Stack && drawStackType === "draw2") {
      pendingDraw += 2;
    } else {
      pendingDraw = 2;
      drawStackType = "draw2";
    }
    nextIndex = getNextPlayer(nextIndex, game.players.length, direction, newPlayers);
    nextState = applyDrawPenalty({ ...nextState, pendingDraw, drawStackType }, nextIndex, pendingDraw);
    nextIndex = getNextPlayer(nextIndex, game.players.length, direction, nextState.players);
    pendingDraw = 0;
    drawStackType = null;
  } else if (card.type === "wild_draw4") {
    const drawCount = game.settings.houseRules.plus4Stack && drawStackType === "wild_draw4"
      ? pendingDraw + 4
      : 4;
    nextIndex = getNextPlayer(nextIndex, game.players.length, direction, newPlayers);
    nextState = applyDrawPenalty(
      { ...nextState, pendingDraw: drawCount, drawStackType: "wild_draw4" },
      nextIndex,
      drawCount
    );
    nextIndex = getNextPlayer(nextIndex, game.players.length, direction, nextState.players);
    pendingDraw = 0;
    drawStackType = null;
  }

  nextState.players.forEach((p, i) => { p.isCurrentTurn = i === nextIndex; });
  return {
    ...nextState,
    currentPlayerIndex: nextIndex,
    playDirection: direction,
    pendingDraw,
    drawStackType,
  };
};

export const drawCard = (game: GameState, playerId: string): GameState => {
  const playerIndex = game.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1 || !game.players[playerIndex].isCurrentTurn) return game;

  if (game.pendingDraw > 0) {
    const afterPenalty = applyDrawPenalty(game, playerIndex, game.pendingDraw);
    const nextIndex = getNextPlayer(playerIndex, game.players.length, game.playDirection, afterPenalty.players);
    afterPenalty.players.forEach((p, i) => { p.isCurrentTurn = i === nextIndex; });
    return { ...afterPenalty, currentPlayerIndex: nextIndex, turnTimer: TURN_TIMER_SECONDS };
  }

  const { drawn, deck } = drawFromDeck(game, 1);
  if (drawn.length === 0) return game;

  const newPlayers = game.players.map((p) => ({ ...p, isCurrentTurn: false }));
  newPlayers[playerIndex] = {
    ...newPlayers[playerIndex],
    hand: [...newPlayers[playerIndex].hand, ...drawn],
    hasCalledDax: false,
    hasCalledUno: false,
  };

  const nextIndex = getNextPlayer(playerIndex, game.players.length, game.playDirection, newPlayers);
  newPlayers[nextIndex].isCurrentTurn = true;

  return {
    ...game,
    players: newPlayers,
    deck,
    currentPlayerIndex: nextIndex,
    turnTimer: TURN_TIMER_SECONDS,
  };
};

export const callUno = (game: GameState, playerId: string): GameState => {
  const idx = game.players.findIndex((p) => p.id === playerId);
  if (idx === -1) return game;
  const player = game.players[idx];
  if (player.hand.length !== 1) return game;

  const newPlayers = [...game.players];
  newPlayers[idx] = { ...player, hasCalledDax: true, hasCalledUno: true };
  return { ...game, players: newPlayers };
};

export const callOutUno = (game: GameState, callerId: string, targetId: string): GameState => {
  const targetIdx = game.players.findIndex((p) => p.id === targetId);
  const callerIdx = game.players.findIndex((p) => p.id === callerId);
  if (targetIdx === -1 || callerIdx === -1) return game;

  const target = game.players[targetIdx];
  if (target.hand.length !== 1 || target.hasCalledUno || target.hasCalledDax) return game;
  if (target.isCurrentTurn) return game;

  const penalty = applyDrawPenalty(game, targetIdx, 2);
  return {
    ...penalty,
    messages: [
      ...game.messages,
      {
        id: `msg-${Date.now()}`,
        playerId: callerId,
        playerName: game.players[callerIdx].name,
        type: "system",
        content: `called out ${target.name} for not saying UNO! (+2 cards)`,
        timestamp: Date.now(),
      },
    ],
  };
};

export const autoPickWildColor = (game: GameState): GameState => {
  if (!game.pendingWildPick) return game;
  const colors: CardColor[] = ["red", "yellow", "green", "blue"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return playCard(game, game.pendingWildPick.playerId, game.pendingWildPick.cardId, color);
};

export const handleAfkTimeout = (game: GameState, playerId: string): GameState => {
  const idx = game.players.findIndex((p) => p.id === playerId);
  if (idx === -1) return game;

  const newPlayers = game.players.map((p) => ({ ...p }));
  newPlayers[idx] = { ...newPlayers[idx], afkStrikes: newPlayers[idx].afkStrikes + 1 };

  if (newPlayers[idx].afkStrikes >= 3 && game.settings.houseRules.afkRule) {
    newPlayers[idx].status = "disconnected";
    const active = newPlayers.filter((p) => p.status === "active");
    if (active.length < 2) {
      return { ...game, players: newPlayers, gameStatus: "finished", winners: game.finishOrder.slice(0, 1) };
    }
  }

  return drawCard({ ...game, players: newPlayers }, playerId);
};

export function calculateScores(game: GameState): ScoreEntry[] {
  return game.players.map((p) => {
    const points = p.hand.reduce((sum, c) => {
      if (c.type === "number") return sum + (c.value ?? 0);
      if (c.type === "skip" || c.type === "reverse" || c.type === "draw2") return sum + SCORING.action;
      return sum + SCORING.wild;
    }, 0);
    const placement = game.finishOrder.indexOf(p.id);
    return {
      playerId: p.id,
      playerName: p.name,
      points,
      cardsRemaining: p.hand.length,
      placement: placement >= 0 ? placement + 1 : game.players.length,
    };
  }).sort((a, b) => a.placement - b.placement);
}

export function gameStateToFirebase(game: GameState): FirebaseGameState {
  return {
    currentPlayerIndex: game.currentPlayerIndex,
    discard: game.discardPile,
    deck: game.deck,
    playDirection: game.playDirection,
    pendingDraw: game.pendingDraw,
    pendingWildPick: game.pendingWildPick
      ? { playerId: game.pendingWildPick.playerId, cardId: game.pendingWildPick.cardId }
      : null,
    activeColor: game.activeColor,
    finishOrder: game.finishOrder,
    winners: game.winners,
  };
}

export function firebaseToGameState(room: FirebaseRoom): GameState | null {
  if (!room.gameState) return null;

  const gs = room.gameState;
  const players: Player[] = room.players.map((fp, i) => ({
    id: fp.id,
    name: fp.name,
    avatarId: fp.avatarId,
    handSize: fp.hand.length,
    hand: fp.hand,
    status: fp.status,
    isCurrentTurn: i === gs.currentPlayerIndex,
    hasCalledDax: fp.hasCalledUno,
    hasCalledUno: fp.hasCalledUno,
    afkStrikes: fp.afkStrikes,
    wins: 0,
    losses: 0,
    isHost: fp.role === "host",
  }));

  return {
    id: `game-${room.code}`,
    roomCode: room.code,
    players,
    deck: gs.deck,
    discardPile: gs.discard,
    currentPlayerIndex: gs.currentPlayerIndex,
    playDirection: gs.playDirection,
    gameStatus: room.status === "ended" ? "finished" : "playing",
    winners: gs.winners,
    finishOrder: gs.finishOrder,
    hostId: room.hostId,
    createdAt: room.createdAt,
    settings: {
      minPlayers: 2,
      maxPlayers: room.settings.maxPlayers as 4,
      handSize: room.settings.handSize as GameSettings["handSize"],
      houseRules: {
        plus2Stack: room.settings.plus2Stack,
        plus4Stack: room.settings.plus4Stack,
        cardChallengeEnabled: false,
        daxCallEnabled: room.settings.daxCallEnabled,
        afkRule: room.settings.afkRule,
        aiReplacement: room.settings.aiReplacement,
      },
      turnTimer: TURN_TIMER_SECONDS,
      autoDrawTimeout: 5,
    },
    turnTimer: TURN_TIMER_SECONDS,
    pendingDraw: gs.pendingDraw,
    activeColor: gs.activeColor,
    pendingWildPick: gs.pendingWildPick
      ? { ...gs.pendingWildPick, deadline: Date.now() + WILD_PICK_SECONDS * 1000 }
      : null,
    drawStackType: null,
    messages: room.messages.map((m) => ({ ...m, type: m.type })),
    spectatorCount: 0,
  };
}

export function syncPlayersHands(game: GameState): FirebaseRoom["players"] {
  return game.players.map((p) => ({
    id: p.id,
    name: p.name,
    color: p.hand[0]?.color ?? "red",
    hand: p.hand,
    role: p.isHost ? "host" : p.status === "spectator" ? "spectator" : "player",
    avatarId: p.avatarId,
    isReady: true,
    afkStrikes: p.afkStrikes,
    hasCalledUno: p.hasCalledUno,
    status: p.status === "spectator" ? "active" : p.status,
  }));
}

// Legacy aliases
export const callDax = callUno;

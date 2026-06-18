import { describe, it, expect } from "vitest";
import type { Card, CardColor, GameState, Player } from "../types/game";
import {
  isValidPlay,
  shuffle,
  getNextPlayer,
  initializeGame,
  playCard,
  drawCard,
  callUno,
  callOutUno,
  calculateScores,
} from "./gameLogic";
import { validatePlayAction } from "./validation";
import { getWinningFinishPlace } from "../config/daxRules";

function card(id: string, color: CardColor, type: Card["type"], value?: number): Card {
  return { id, color, type, value };
}

function basePlayer(id: string, hand: Card[] = [], isCurrentTurn = false): Player {
  return {
    id,
    name: id,
    avatarId: "avatar-1",
    handSize: hand.length,
    hand,
    status: "active",
    isCurrentTurn,
    hasCalledDax: false,
    hasCalledUno: false,
    afkStrikes: 0,
    wins: 0,
    losses: 0,
  };
}

function minimalGame(overrides: Partial<GameState> = {}): GameState {
  const p1 = basePlayer("p1", [card("c1", "red", "number", 5)], true);
  const p2 = basePlayer("p2", [card("c2", "blue", "number", 3)]);
  return {
    id: "test-game",
    roomCode: "123456",
    players: [p1, p2],
    deck: [card("d1", "green", "number", 1)],
    discardPile: [card("top", "red", "number", 5)],
    currentPlayerIndex: 0,
    playDirection: "clockwise",
    gameStatus: "playing",
    winners: [],
    finishOrder: [],
    hostId: "p1",
    createdAt: Date.now(),
    settings: {
      minPlayers: 2,
      maxPlayers: 8,
      handSize: 7,
      houseRules: {
        plus2Stack: false,
        plus4Stack: false,
        cardChallengeEnabled: false,
        daxCallEnabled: true,
        afkRule: true,
        aiReplacement: false,
      },
      turnTimer: 30,
      autoDrawTimeout: 5,
    },
    turnTimer: 30,
    pendingDraw: 0,
    activeColor: "red",
    pendingWildPick: null,
    drawStackType: null,
    messages: [],
    spectatorCount: 0,
    ...overrides,
  };
}

describe("isValidPlay", () => {
  const top = card("top", "red", "number", 5);

  it("allows matching color", () => {
    expect(isValidPlay(card("a", "red", "number", 2), top, null)).toBe(true);
  });

  it("allows matching number", () => {
    expect(isValidPlay(card("a", "blue", "number", 5), top, null)).toBe(true);
  });

  it("allows wild cards", () => {
    expect(isValidPlay(card("a", "red", "wild"), top, null)).toBe(true);
  });

  it("rejects illegal card", () => {
    expect(isValidPlay(card("a", "blue", "number", 2), top, null)).toBe(false);
  });

  it("uses active color override", () => {
    expect(isValidPlay(card("a", "green", "number", 2), top, "green")).toBe(true);
  });
});

describe("shuffle", () => {
  it("preserves length", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(5);
  });

  it("does not mutate original", () => {
    const arr = [1, 2, 3];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe("getNextPlayer", () => {
  const players = [basePlayer("a"), basePlayer("b"), basePlayer("c")];

  it("moves clockwise", () => {
    expect(getNextPlayer(0, 3, "clockwise", players)).toBe(1);
    expect(getNextPlayer(2, 3, "clockwise", players)).toBe(0);
  });

  it("moves counter-clockwise", () => {
    expect(getNextPlayer(0, 3, "counterClockwise", players)).toBe(2);
  });

  it("skips inactive players", () => {
    const mixed = [
      basePlayer("a"),
      { ...basePlayer("b"), status: "finished" as const },
      basePlayer("c"),
    ];
    expect(getNextPlayer(0, 3, "clockwise", mixed)).toBe(2);
  });
});

describe("initializeGame", () => {
  it("creates game with dealt hands", () => {
    const players = [basePlayer("p1"), basePlayer("p2")];
    const game = initializeGame(players, "p1", 7, "ROOM01");
    expect(game.players).toHaveLength(2);
    expect(game.players[0].hand).toHaveLength(7);
    expect(game.discardPile).toHaveLength(1);
    expect(game.roomCode).toBe("ROOM01");
  });

  it("sets first player as current turn", () => {
    const game = initializeGame([basePlayer("p1"), basePlayer("p2")], "p1", 7);
    expect(game.players[0].isCurrentTurn).toBe(true);
    expect(game.currentPlayerIndex).toBe(0);
  });
});

describe("validatePlayAction", () => {
  it("rejects play when not your turn", () => {
    const game = minimalGame();
    const result = validatePlayAction(game, "p2", "c2");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("Not your turn");
  });

  it("accepts legal color match", () => {
    const game = minimalGame();
    expect(validatePlayAction(game, "p1", "c1").ok).toBe(true);
  });
});

describe("playCard", () => {
  it("plays matching card and advances turn", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [card("c1", "red", "number", 5), card("c3", "blue", "number", 2)], true),
        basePlayer("p2", [card("c2", "blue", "number", 3)]),
      ],
    });
    const next = playCard(game, "p1", "c1");
    expect(next.discardPile).toHaveLength(2);
    expect(next.players[0].hand).toHaveLength(1);
    expect(next.players[1].isCurrentTurn).toBe(true);
  });

  it("rejects illegal play", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [card("c1", "blue", "number", 2)], true),
        basePlayer("p2"),
      ],
    });
    const next = playCard(game, "p1", "c1");
    expect(next).toBe(game);
  });

  it("sets pending wild pick when color not chosen", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [card("w1", "red", "wild")], true),
        basePlayer("p2"),
      ],
    });
    const next = playCard(game, "p1", "w1");
    expect(next.pendingWildPick?.cardId).toBe("w1");
  });

  it("finishes game when last card played", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [card("c1", "red", "number", 5)], true),
        basePlayer("p2", [card("x", "blue", "number", 1)]),
      ],
    });
    const next = playCard(game, "p1", "c1");
    expect(next.gameStatus).toBe("finished");
    expect(next.winners).toEqual(["p1"]);
  });

  it("applies skip to next active player", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [card("s1", "red", "skip"), card("extra", "red", "number", 1)], true),
        basePlayer("p2"),
        basePlayer("p3"),
      ],
    });
    const next = playCard(game, "p1", "s1");
    expect(next.players[2].isCurrentTurn).toBe(true);
  });

  it("2-player reverse flips direction without skipping opponent", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [card("r1", "red", "reverse"), card("extra", "red", "number", 1)], true),
        basePlayer("p2"),
      ],
    });
    const next = playCard(game, "p1", "r1");
    expect(next.playDirection).toBe("counterClockwise");
    expect(next.players[1].isCurrentTurn).toBe(true);
  });

  it("5-player: first finisher spectates, second finisher wins", () => {
    const players = Array.from({ length: 5 }, (_, i) =>
      basePlayer(
        `p${i + 1}`,
        i === 0 ? [card("c1", "red", "number", 5)] : [card(`h${i}`, "blue", "number", 1)],
        i === 0
      )
    );
    const game = minimalGame({ players });
    const afterFirst = playCard(game, "p1", "c1");
    expect(afterFirst.gameStatus).toBe("playing");
    expect(afterFirst.players[0].status).toBe("spectator");
    expect(afterFirst.finishOrder).toEqual(["p1"]);

    const ready = {
      ...afterFirst,
      players: afterFirst.players.map((p, i) =>
        i === 1 ? { ...p, hand: [card("c2", "red", "number", 5)], isCurrentTurn: true } : { ...p, isCurrentTurn: false }
      ),
      currentPlayerIndex: 1,
      activeColor: "red" as const,
    };
    const afterSecond = playCard(ready, "p2", "c2");
    expect(afterSecond.gameStatus).toBe("finished");
    expect(afterSecond.winners).toEqual(["p2"]);
  });
});

describe("drawCard", () => {
  it("draws one card and advances turn", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [], true),
        basePlayer("p2", [card("c2", "blue", "number", 3)]),
      ],
    });
    const next = drawCard(game, "p1");
    expect(next.players[0].hand).toHaveLength(1);
    expect(next.players[1].isCurrentTurn).toBe(true);
  });

  it("rejects draw when not current player", () => {
    const game = minimalGame();
    expect(drawCard(game, "p2")).toBe(game);
  });
});

describe("callUno", () => {
  it("marks uno when one card left", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [card("c1", "red", "number", 1)], true),
        basePlayer("p2"),
      ],
    });
    const next = callUno(game, "p1");
    expect(next.players[0].hasCalledUno).toBe(true);
    expect(next.players[0].hasCalledDax).toBe(true);
  });

  it("ignores call with wrong hand size", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [card("c1", "red", "number", 5), card("c2", "blue", "number", 2)], true),
        basePlayer("p2"),
      ],
    });
    expect(callUno(game, "p1")).toBe(game);
  });
});

describe("callOutUno", () => {
  it("penalizes target who forgot uno", () => {
    const game = minimalGame({
      players: [
        basePlayer("p1", [card("a", "red", "number", 1)]),
        basePlayer("p2", [card("b", "blue", "number", 2)], false),
      ],
      deck: [card("d1", "green", "number", 1), card("d2", "yellow", "number", 2)],
    });
    const next = callOutUno(game, "p1", "p2");
    expect(next.players[1].hand.length).toBeGreaterThan(1);
  });
});

describe("win tiers", () => {
  it("matches locked DAX finish-place rules", () => {
    expect(getWinningFinishPlace(2)).toBe(1);
    expect(getWinningFinishPlace(4)).toBe(1);
    expect(getWinningFinishPlace(5)).toBe(2);
    expect(getWinningFinishPlace(8)).toBe(3);
  });
});

describe("calculateScores", () => {
  it("sorts by finish order", () => {
    const game = minimalGame({
      finishOrder: ["p1"],
      players: [
        { ...basePlayer("p1", []), status: "finished" },
        basePlayer("p2", [card("c", "red", "number", 5)]),
      ],
    });
    const scores = calculateScores(game);
    expect(scores[0].playerId).toBe("p1");
  });
});

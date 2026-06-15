import { create } from "zustand";
import type { CardColor, GameState, GameMessage, Player } from "../types/game";
import {
  initializeGame,
  playCard,
  drawCard,
  callUno,
  callOutUno,
  autoPickWildColor,
  handleAfkTimeout,
} from "../lib/gameLogic";

interface GameStore {
  game: GameState | null;
  isAnimating: boolean;
  initializeGame: (players: Player[], hostId: string, handSize: number, roomCode?: string) => void;
  setGameFromRemote: (game: GameState, localPlayerId: string) => void;
  playCard: (playerId: string, cardId: string, chosenColor?: CardColor) => boolean;
  drawCard: (playerId: string) => void;
  callUno: (playerId: string) => void;
  callOutUno: (callerId: string, targetId: string) => void;
  pickWildColor: (playerId: string, cardId: string, color: CardColor) => boolean;
  handleAfk: (playerId: string) => void;
  sendEmote: (message: GameMessage) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,
  isAnimating: false,

  initializeGame: (players, hostId, handSize, roomCode = "") => {
    set({ game: initializeGame(players, hostId, handSize, roomCode) });
  },

  setGameFromRemote: (remote, localPlayerId) => {
    const current = get().game;
    if (!current) {
      set({ game: remote });
      return;
    }
    const localHand = current.players.find((p) => p.id === localPlayerId)?.hand;
    const merged = {
      ...remote,
      players: remote.players.map((p) =>
        p.id === localPlayerId && localHand ? { ...p, hand: localHand } : p
      ),
    };
    set({ game: merged });
  },

  playCard: (playerId, cardId, chosenColor) => {
    const state = get();
    if (!state.game) return false;
    set({ isAnimating: true });
    const before = state.game.discardPile.length;
    let next = playCard(state.game, playerId, cardId, chosenColor);
    if (next.pendingWildPick && !chosenColor) {
      set({ game: next, isAnimating: false });
      return true;
    }
    if (next.pendingWildPick) {
      next = autoPickWildColor(next);
    }
    set({ game: next });
    setTimeout(() => set({ isAnimating: false }), 300);
    return next.discardPile.length !== before || next.gameStatus !== state.game.gameStatus;
  },

  drawCard: (playerId) => {
    set((state) => {
      if (!state.game) return state;
      return { game: drawCard(state.game, playerId), isAnimating: true };
    });
    setTimeout(() => set({ isAnimating: false }), 200);
  },

  callUno: (playerId) => {
    set((state) => {
      if (!state.game) return state;
      return { game: callUno(state.game, playerId) };
    });
  },

  callOutUno: (callerId, targetId) => {
    set((state) => {
      if (!state.game) return state;
      return { game: callOutUno(state.game, callerId, targetId) };
    });
  },

  pickWildColor: (playerId, cardId, color) => {
    return get().playCard(playerId, cardId, color);
  },

  handleAfk: (playerId) => {
    set((state) => {
      if (!state.game) return state;
      return { game: handleAfkTimeout(state.game, playerId) };
    });
  },

  sendEmote: (message) => {
    set((state) => {
      if (!state.game) return state;
      return { game: { ...state.game, messages: [...state.game.messages.slice(-49), message] } };
    });
  },

  updateGameState: (updates) => {
    set((state) => ({ game: state.game ? { ...state.game, ...updates } : null }));
  },

  resetGame: () => set({ game: null, isAnimating: false }),
}));

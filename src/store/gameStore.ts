import { create } from "zustand";
import type { GameState, Player } from "../types/game";
import { initializeGame, playCard, drawCard, callDax } from "../utils/gameLogic";
import { runBotTurn as executeBotTurn } from "../utils/botAI";

interface GameStore {
  game: GameState | null;
  initializeGame: (players: Player[], hostId: string, handSize: number) => void;
  playCard: (playerId: string, cardId: string, chosenColor?: string) => boolean;
  drawCard: (playerId: string) => void;
  callDax: (playerId: string) => void;
  runBotTurn: () => void;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: null,

  initializeGame: (players, hostId, handSize) => {
    set({ game: initializeGame(players, hostId, handSize) });
  },

  playCard: (playerId, cardId, chosenColor) => {
    const state = get();
    if (!state.game) return false;
    const before = state.game.players.find((p) => p.id === playerId)?.hand.length ?? 0;
    const next = playCard(state.game, playerId, cardId, chosenColor);
    set({ game: next });
    const after = next.players.find((p) => p.id === playerId)?.hand.length ?? 0;
    return before !== after || next.discardPile.length !== state.game.discardPile.length;
  },

  drawCard: (playerId) => {
    set((state) => {
      if (!state.game) return state;
      return { game: drawCard(state.game, playerId) };
    });
  },

  callDax: (playerId) => {
    set((state) => {
      if (!state.game) return state;
      return { game: callDax(state.game, playerId) };
    });
  },

  runBotTurn: () => {
    set((state) => {
      if (!state.game) return state;
      return { game: executeBotTurn(state.game) };
    });
  },

  updateGameState: (updates) => {
    set((state) => ({ game: state.game ? { ...state.game, ...updates } : null }));
  },

  resetGame: () => set({ game: null }),
}));

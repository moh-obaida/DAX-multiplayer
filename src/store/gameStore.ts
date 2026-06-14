import { create } from "zustand";
import type { GameState, Player } from "../types/game";
import { initializeGame, playCard, drawCard, callDax } from "../utils/gameLogic";

interface GameStore {
  game: GameState | null;
  initializeGame: (players: Player[], hostId: string, handSize: number) => void;
  playCard: (playerId: string, cardId: string, chosenColor?: string) => void;
  drawCard: (playerId: string) => void;
  callDax: (playerId: string) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  game: null,

  initializeGame: (players, hostId, handSize) => {
    set({ game: initializeGame(players, hostId, handSize) });
  },

  playCard: (playerId, cardId, chosenColor) => {
    set((state) => {
      if (!state.game) return state;
      return { game: playCard(state.game, playerId, cardId, chosenColor) };
    });
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

  updateGameState: (updates) => {
    set((state) => ({ game: state.game ? { ...state.game, ...updates } : null }));
  },

  resetGame: () => set({ game: null }),
}));

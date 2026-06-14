import { create } from "zustand";
import type { GameState, Player } from "../types/game";
import { initializeGame, playCard, drawCard } from "../utils/gameLogic";

interface GameStore {
  game: GameState | null;
  initializeGame: (players: Player[], hostId: string, handSize: number) => void;
  playCard: (playerId: string, cardId: string, chosenColor?: string) => void;
  drawCard: (playerId: string) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  game: null,

  initializeGame: (players, hostId, handSize) => {
    const newGame = initializeGame(players, hostId, handSize);
    set({ game: newGame });
  },

  playCard: (playerId, cardId, chosenColor) => {
    set((state) => {
      if (!state.game) return state;
      const newGame = playCard(state.game, playerId, cardId, chosenColor);
      return { game: newGame };
    });
  },

  drawCard: (playerId) => {
    set((state) => {
      if (!state.game) return state;
      const newGame = drawCard(state.game, playerId);
      return { game: newGame };
    });
  },

  updateGameState: (updates) => {
    set((state) => ({
      game: state.game ? { ...state.game, ...updates } : null,
    }));
  },

  resetGame: () => {
    set({ game: null });
  },
}));

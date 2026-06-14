import { useEffect } from "react";
import { useGameStore } from "./store/gameStore";
import AppShell from "./components/UI/AppShell";
import GameBoard from "./components/Game/GameBoard";
import type { Player } from "./types/game";

export default function App() {
  const game = useGameStore((state) => state.game);
  const initializeGame = useGameStore((state) => state.initializeGame);

  useEffect(() => {
    if (!game) {
      const mockPlayers: Player[] = [
        {
          id: "player-1",
          name: "You",
          avatarId: "avatar-1",
          handSize: 7,
          hand: [],
          status: "active",
          isCurrentTurn: true,
          wins: 0,
          losses: 0,
        },
        {
          id: "player-2",
          name: "Player 2",
          avatarId: "avatar-2",
          handSize: 7,
          hand: [],
          status: "active",
          isCurrentTurn: false,
          wins: 0,
          losses: 0,
        },
      ];
      initializeGame(mockPlayers, "player-1", 7);
    }
  }, [game, initializeGame]);

  return (
    <AppShell>
      <GameBoard />
    </AppShell>
  );
}

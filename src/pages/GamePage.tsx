import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useRoomStore } from "../store/roomStore";
import { useAuthStore } from "../store/authStore";
import GameTable from "../components/Game/GameTable";
import type { Player } from "../types/game";

function buildDemoPlayers(localId: string, localName: string, handSize: number): Player[] {
  return [
    {
      id: localId,
      name: localName,
      avatarId: "avatar-1",
      handSize,
      hand: [],
      status: "active",
      isCurrentTurn: true,
      hasCalledDax: false,
      wins: 0,
      losses: 0,
      isBot: false,
    },
    {
      id: "bot-demo-1",
      name: "NadiaK",
      avatarId: "avatar-2",
      handSize,
      hand: [],
      status: "active",
      isCurrentTurn: false,
      hasCalledDax: false,
      wins: 0,
      losses: 0,
      isBot: true,
    },
  ];
}

export default function GamePage() {
  const { gameId } = useParams();
  const game = useGameStore((s) => s.game);
  const initializeGame = useGameStore((s) => s.initializeGame);
  const resetGame = useGameStore((s) => s.resetGame);
  const room = useRoomStore((s) => s.currentRoom);
  const loadRoomByCode = useRoomStore((s) => s.loadRoomByCode);
  const user = useAuthStore((s) => s.user);

  const localId = user?.id || "guest";
  const localName = user?.username || "You";

  useEffect(() => {
    resetGame();

    const isDemo = gameId === "demo" || gameId === "quick-match";
    let activeRoom = room?.code === gameId ? room : null;
    if (!activeRoom && gameId && !isDemo) {
      loadRoomByCode(gameId);
      activeRoom = useRoomStore.getState().currentRoom;
    }

    const handSize = activeRoom?.settings.handSize ?? 7;
    const hostId = activeRoom?.hostId ?? localId;

    const players: Player[] = activeRoom
      ? activeRoom.players.map((p, i) => ({
          id: p.id,
          name: p.username,
          avatarId: p.avatarId,
          handSize,
          hand: [],
          status: "active" as const,
          isCurrentTurn: i === 0,
          hasCalledDax: false,
          wins: 0,
          losses: 0,
          isBot: p.isBot ?? false,
        }))
      : buildDemoPlayers(localId, localName, handSize);

    initializeGame(players, hostId, handSize);

    return () => resetGame();
  }, [gameId, initializeGame, resetGame, loadRoomByCode, localId, localName]);

  if (!game) {
    return (
      <div className="h-screen flex items-center justify-center bg-emerald-dark game-grid-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-gold uppercase tracking-widest">Loading table…</p>
        </div>
      </div>
    );
  }

  return <GameTable localPlayerId={localId} />;
}

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useRoomStore } from "../store/roomStore";
import { useAuthStore } from "../store/authStore";
import GameTable from "../components/Game/GameTable";
import type { Player } from "../types/game";

function buildDemoPlayers(localId: string, localName: string, count: number, handSize: number): Player[] {
  const names = ["You", "NadiaK", "OmarPlays", "ZaraCards", "KhalidDAX", "LaylaM", "YusufG", "SamirT"];
  return Array.from({ length: count }, (_, i) => ({
    id: i === 0 ? localId : `bot-${i}`,
    name: i === 0 ? localName : names[i] || `Player ${i + 1}`,
    avatarId: `avatar-${(i % 8) + 1}`,
    handSize,
    hand: [],
    status: "active" as const,
    isCurrentTurn: i === 0,
    hasCalledDax: false,
    wins: 0,
    losses: 0,
  }));
}

export default function GamePage() {
  const { gameId } = useParams();
  const game = useGameStore((s) => s.game);
  const initializeGame = useGameStore((s) => s.initializeGame);
  const room = useRoomStore((s) => s.currentRoom);
  const user = useAuthStore((s) => s.user);

  const localId = user?.id || "guest";
  const localName = user?.username || "You";

  useEffect(() => {
    if (game) return;

    const handSize = room?.settings.handSize ?? 7;
    const playerCount = room?.players.length ?? 4;
    const players = room
      ? room.players.map((p, i) => ({
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
        }))
      : buildDemoPlayers(localId, localName, playerCount, handSize);

    initializeGame(players, room?.hostId || localId, handSize);
  }, [game, initializeGame, room, localId, localName, gameId]);

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

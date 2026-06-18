import { lazy, Suspense, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useAuthStore } from "../store/authStore";
import { useMultiplayer } from "../hooks/useMultiplayer";
import { usePlayerId } from "../hooks/usePlayerId";
import { getRoom } from "../lib/firebase";
import type { Player } from "../types/game";

const GameBoard = lazy(() => import("../components/Game/GameBoard"));

function buildDemoPlayers(localId: string, localName: string): Player[] {
  return [
    {
      id: localId,
      name: localName,
      avatarId: "avatar-1",
      handSize: 7,
      hand: [],
      status: "active",
      isCurrentTurn: true,
      hasCalledDax: false,
      hasCalledUno: false,
      afkStrikes: 0,
      wins: 0,
      losses: 0,
    },
    {
      id: "bot-demo-1",
      name: "NadiaK",
      avatarId: "avatar-2",
      handSize: 7,
      hand: [],
      status: "active",
      isCurrentTurn: false,
      hasCalledDax: false,
      hasCalledUno: false,
      afkStrikes: 0,
      wins: 0,
      losses: 0,
      isBot: true,
    },
  ];
}

export default function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = useGameStore((s) => s.game);
  const initializeGame = useGameStore((s) => s.initializeGame);
  const resetGame = useGameStore((s) => s.resetGame);
  const user = useAuthStore((s) => s.user);

  const playerId = usePlayerId();
  const localId = playerId ?? user?.id ?? "guest";
  const localName = user?.username || "You";
  const isDemo = gameId === "demo" || gameId === "quick-match";
  const isHost = game?.hostId === localId;

  const { connected } = useMultiplayer(isDemo ? undefined : gameId, localId, isHost);

  useEffect(() => {
    resetGame();

    const boot = async () => {
      if (isDemo) {
        initializeGame(buildDemoPlayers(localId, localName), localId, 7, "demo");
        return;
      }

      if (!gameId) return;
      const room = await getRoom(gameId);
      if (room?.gameState) {
        const players: Player[] = room.players.map((p, i) => ({
          id: p.id,
          name: p.name,
          avatarId: p.avatarId,
          handSize: room.settings.handSize,
          hand: p.hand,
          status: p.status,
          isCurrentTurn: i === room.gameState!.currentPlayerIndex,
          hasCalledDax: p.hasCalledUno,
          hasCalledUno: p.hasCalledUno,
          afkStrikes: p.afkStrikes,
          wins: 0,
          losses: 0,
          isHost: p.role === "host",
        }));
        initializeGame(players, room.hostId, room.settings.handSize, gameId);
      } else {
        navigate(`/room/${gameId}`);
      }
    };

    boot();
    return () => resetGame();
  }, [gameId, initializeGame, resetGame, localId, localName, isDemo, navigate]);

  const handleRematch = () => {
    if (isDemo) {
      resetGame();
      initializeGame(buildDemoPlayers(localId, localName), localId, 7, "demo");
    } else if (gameId) {
      navigate(`/room/${gameId}`);
    }
  };

  if (!game) {
    return (
      <div className="h-screen flex items-center justify-center bg-emerald game-grid-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-gold uppercase tracking-widest">Loading table…</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-emerald">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GameBoard
        localPlayerId={localId}
        roomCode={isDemo ? undefined : gameId}
        onRematch={handleRematch}
        connected={connected}
      />
    </Suspense>
  );
}

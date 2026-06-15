import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import LobbyWait from "../components/Lobby/LobbyWait";
import CardPanel from "../components/UI/CardPanel";
import Button from "../components/UI/Button";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import {
  getRoom,
  joinRoom,
  subscribeRoom,
  toggleReady,
  leaveRoom,
  startGameInRoom,
  updateRoomSettings,
} from "../lib/firebase";
import type { FirebaseRoom } from "../types/firebase";
import type { Player } from "../types/game";
import { useGameStore } from "../store/gameStore";

export default function Lobby() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const initializeGame = useGameStore((s) => s.initializeGame);

  const [room, setRoom] = useState<FirebaseRoom | null>(null);
  const [loading, setLoading] = useState(true);

  const playerId = user?.id || `guest-${Date.now()}`;
  const playerName = user?.username || "Guest";

  useEffect(() => {
    if (!roomCode) return;

    const load = async () => {
      let r = await getRoom(roomCode);
      if (r && !r.players.some((p) => p.id === playerId)) {
        r = await joinRoom(roomCode, playerId, playerName) ?? r;
      }
      setRoom(r);
      setLoading(false);
    };
    load();

    const unsub = subscribeRoom(roomCode, setRoom);
    return unsub;
  }, [roomCode, playerId, playerName]);

  if (loading) {
    return (
      <PageShell title="Loading…">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </PageShell>
    );
  }

  if (!room || room.code !== roomCode) {
    return (
      <PageShell title="Room Not Found">
        <CardPanel>
          <p className="text-ivory-muted mb-4">
            No room found for code <span className="font-mono text-gold">{roomCode}</span>.
          </p>
          <Button to="/lobby" variant="primary">Back to Lobby</Button>
        </CardPanel>
      </PageShell>
    );
  }

  const handleStart = async () => {
    const players: Player[] = room.players.map((p, i) => ({
      id: p.id,
      name: p.name,
      avatarId: p.avatarId,
      handSize: room.settings.handSize,
      hand: [],
      status: "active",
      isCurrentTurn: i === 0,
      hasCalledDax: false,
      hasCalledUno: false,
      afkStrikes: 0,
      wins: 0,
      losses: 0,
      isHost: p.role === "host",
    }));

    await startGameInRoom(room.code, players, room.hostId, room.settings.handSize);
    initializeGame(players, room.hostId, room.settings.handSize, room.code);
    navigate(`/game/${room.code}`);
  };

  return (
    <PageShell maxWidth="full">
      <LobbyWait
        room={room}
        localPlayerId={playerId}
        onStart={handleStart}
        onLeave={async () => {
          await leaveRoom(room.code, playerId);
          addToast("Left the room", "info");
          navigate("/lobby");
        }}
        onToggleReady={async () => {
          await toggleReady(room.code, playerId);
        }}
        onCopyCode={() => {
          navigator.clipboard.writeText(room.code);
          addToast("Code copied!", "success");
        }}
        onUpdateSettings={async (partial) => {
          await updateRoomSettings(room.code, partial);
        }}
      />
    </PageShell>
  );
}

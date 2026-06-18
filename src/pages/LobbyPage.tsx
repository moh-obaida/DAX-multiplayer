import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import RoomCreate from "../components/Lobby/RoomCreate";
import RoomJoin from "../components/Lobby/RoomJoin";
import CardPanel from "../components/UI/CardPanel";
import Button from "../components/UI/Button";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import { usePlayerId } from "../hooks/usePlayerId";
import { createRoom, joinRoom } from "../lib/firebase";
import { copy } from "../lib/copy";

export default function LobbyPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const playerId = usePlayerId();
  const playerName = user?.username || "Guest";

  const handleCreate = async () => {
    if (!playerId) return;
    setLoading(true);
    try {
      const room = await createRoom(playerId, playerName);
      addToast(copy.toast.roomCreated(room.code), "success");
      navigate(`/room/${room.code}`);
    } catch (e) {
      const msg = e instanceof Error && e.message === "RATE_LIMIT"
        ? "Wait 30 seconds before creating another room"
        : copy.toast.createFailed;
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!playerId) return;
    if (joinCode.length !== 6) {
      addToast(copy.toast.invalidCode, "error");
      return;
    }
    setLoading(true);
    try {
      const room = await joinRoom(joinCode, playerId, playerName);
      if (!room) {
        addToast(copy.toast.roomNotFound, "error");
        return;
      }
      navigate(`/room/${joinCode}`);
    } catch {
      addToast(copy.toast.joinFailed, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMatch = () => {
    addToast(copy.toast.demoStart, "info");
    navigate("/game/demo");
  };

  return (
    <PageShell title="Game Lobby" subtitle="Find a table, host a room, or join with a code." maxWidth="full">
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <CardPanel glow highlight className="relative overflow-hidden group h-full">
              <p className="text-gold text-[10px] uppercase tracking-widest mb-2">Fastest way in</p>
              <h3 className="font-display text-xl font-bold text-ivory mb-2">Quick Match</h3>
              <p className="text-sm text-ivory-muted mb-4">Play a local demo game to learn the rules.</p>
              <Button variant="primary" onClick={handleQuickMatch}>Play Demo</Button>
            </CardPanel>
            <RoomCreate onCreate={handleCreate} loading={loading} />
          </div>
          <RoomJoin code={joinCode} onCodeChange={setJoinCode} onJoin={handleJoin} loading={loading} />
        </div>

        <CardPanel title="Default Rules">
          <ul className="text-sm text-ivory-muted space-y-2">
            <li>· 2–8 players per room</li>
            <li>· 7 cards · 30s turn timer</li>
            <li>· UNO call required at 1 card</li>
            <li>· Emotes + phrases chat only</li>
          </ul>
          <Button variant="ghost" size="sm" className="mt-4" to="/help">Full rules →</Button>
        </CardPanel>
      </div>
    </PageShell>
  );
}

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import CardPanel from "../components/UI/CardPanel";
import PageShell from "../components/layout/PageShell";
import { useRoomStore } from "../store/roomStore";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import type { HandSizeOption } from "../config/daxRules";

const HAND_SIZES: HandSizeOption[] = [7, 10, 14, 21];

export default function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const room = useRoomStore((s) => s.currentRoom);
  const loadRoomByCode = useRoomStore((s) => s.loadRoomByCode);
  const joinRoomByCode = useRoomStore((s) => s.joinRoomByCode);
  const updateSettings = useRoomStore((s) => s.updateSettings);
  const toggleReady = useRoomStore((s) => s.toggleReady);
  const leaveRoom = useRoomStore((s) => s.leaveRoom);
  const addBotPlayer = useRoomStore((s) => s.addBotPlayer);
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);

  const playerId = user?.id || "guest";
  const playerName = user?.username || "Guest";

  useEffect(() => {
    if (!roomCode) return;
    if (room?.code === roomCode) return;
    if (loadRoomByCode(roomCode)) {
      joinRoomByCode(roomCode, playerId, playerName);
    }
  }, [roomCode, room?.code, loadRoomByCode, joinRoomByCode, playerId, playerName]);

  const isHost = room?.hostId === playerId;
  const allReady = room?.players.every((p) => p.isReady) ?? false;
  const me = room?.players.find((p) => p.id === playerId);

  if (!room || room.code !== roomCode) {
    return (
      <PageShell title="Room Not Found">
        <CardPanel>
          <p className="text-ivory-muted mb-4">No room found for code <span className="font-mono text-gold">{roomCode}</span>. Check the code or create a new room.</p>
          <div className="flex gap-3">
            <Button to="/play" variant="primary">Back to Lobby</Button>
            <Button to="/" variant="secondary">Main Menu</Button>
          </div>
        </CardPanel>
      </PageShell>
    );
  }

  const startGame = () => {
    if (room.players.length < 2) {
      addToast("Need at least 2 players — add a bot or wait for a friend", "error");
      return;
    }
    if (!allReady) {
      addToast("All players must be ready", "error");
      return;
    }
    navigate(`/game/${room.code}`);
  };

  const handleLeave = () => {
    leaveRoom();
    addToast("Left the room", "info");
    navigate("/play");
  };

  return (
    <PageShell maxWidth="full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-gold text-xs uppercase tracking-widest mb-1">Private Room Lobby</p>
          <h1 className="font-display text-3xl font-bold text-ivory">
            Room <span className="text-gold font-mono tracking-wider">{room.code}</span>
          </h1>
          <p className="text-sm text-ivory-dim mt-1">{room.players.length}/{room.settings.maxPlayers} players · {room.settings.handSize}-card hands</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(room.code); addToast("Code copied!", "success"); }}>
            Copy Code
          </Button>
          <Button variant="neon" onClick={() => addToast("Invite link copied to clipboard", "success")}>Invite Friends</Button>
          <Button variant="ghost" onClick={handleLeave}>Leave Room</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CardPanel title={`Players (${room.players.length}/${room.settings.maxPlayers})`} highlight={allReady}>
            <div className="space-y-3">
              {room.players.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-emerald-dark/50 border border-gold/10">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-display font-bold text-gold">
                      {p.username[0]?.toUpperCase()}
                    </span>
                    <div>
                      <span className="text-ivory font-medium">{p.username}</span>
                      {p.isHost && <span className="ml-2 dax-badge text-[10px]">Host</span>}
                      {p.isBot && <span className="ml-2 text-[10px] text-ivory-dim uppercase">Bot</span>}
                    </div>
                  </div>
                  <span className={`text-xs uppercase tracking-wider font-medium ${p.isReady ? "text-green" : "text-ivory-dim"}`}>
                    {p.isReady ? "Ready" : "Waiting"}
                  </span>
                </div>
              ))}
              {Array.from({ length: room.settings.maxPlayers - room.players.length }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg border border-dashed border-gold/15 text-center text-ivory-dim text-sm">
                  Waiting for player…
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {!isHost && me && (
                <Button variant="primary" fullWidth onClick={() => toggleReady(playerId)}>
                  {me.isReady ? "Unready" : "Ready Up"}
                </Button>
              )}
              {isHost && (
                <>
                  <Button variant="secondary" onClick={addBotPlayer} disabled={room.players.length >= room.settings.maxPlayers}>
                    Add Bot
                  </Button>
                  <Button variant="primary" fullWidth onClick={startGame} disabled={room.players.length < 2}>
                    Start Game
                  </Button>
                </>
              )}
            </div>
          </CardPanel>
        </div>

        <CardPanel title="Room Settings" glow={isHost}>
          <div className="space-y-5 text-sm">
            <div>
              <label className="text-gold text-xs uppercase tracking-wider block mb-2">Max Players (2–8)</label>
              <input type="range" min={2} max={8} disabled={!isHost} value={room.settings.maxPlayers}
                onChange={(e) => updateSettings({ maxPlayers: +e.target.value })}
                className="w-full accent-gold" />
              <span className="font-display text-gold">{room.settings.maxPlayers}</span>
            </div>
            <div>
              <label className="text-gold text-xs uppercase tracking-wider block mb-2">Starting Hand</label>
              <div className="grid grid-cols-4 gap-2">
                {HAND_SIZES.map((s) => (
                  <button key={s} type="button" disabled={!isHost} onClick={() => updateSettings({ handSize: s })}
                    className={`py-2 rounded-lg border text-center font-mono ${room.settings.handSize === s ? "border-gold bg-gold/15 text-gold" : "border-gold/20 text-ivory-muted"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-ivory-muted">DAX! call</span>
              <input type="checkbox" disabled={!isHost} checked={room.settings.daxCallEnabled}
                onChange={(e) => updateSettings({ daxCallEnabled: e.target.checked })} className="accent-gold w-5 h-5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-ivory-muted">Custom rules</span>
              <input type="checkbox" disabled={!isHost} checked={room.settings.customRules}
                onChange={(e) => updateSettings({ customRules: e.target.checked })} className="accent-gold w-5 h-5" />
            </label>
            {room.settings.customRules && (
              <div className="pl-3 border-l-2 border-gold/30 space-y-2 text-xs text-ivory-dim">
                <label className="flex justify-between"><span>Stacking</span>
                  <input type="checkbox" disabled={!isHost} checked={room.settings.houseRules.stackingEnabled}
                    onChange={(e) => updateSettings({ houseRules: { ...room.settings.houseRules, stackingEnabled: e.target.checked } })} className="accent-gold" />
                </label>
                <label className="flex justify-between"><span>Forced play</span>
                  <input type="checkbox" disabled={!isHost} checked={room.settings.houseRules.forcingPlayEnabled}
                    onChange={(e) => updateSettings({ houseRules: { ...room.settings.houseRules, forcingPlayEnabled: e.target.checked } })} className="accent-gold" />
                </label>
                <label className="flex justify-between"><span>Wild +4 challenge</span>
                  <input type="checkbox" disabled={!isHost} checked={room.settings.houseRules.cardChallengeEnabled}
                    onChange={(e) => updateSettings({ houseRules: { ...room.settings.houseRules, cardChallengeEnabled: e.target.checked } })} className="accent-gold" />
                </label>
              </div>
            )}
          </div>
        </CardPanel>
      </div>
    </PageShell>
  );
}

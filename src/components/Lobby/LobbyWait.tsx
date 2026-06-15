import Button from "../UI/Button";
import CardPanel from "../UI/CardPanel";
import Badge from "../Common/Badge";
import GameSettingsModal from "../Modals/GameSettingsModal";
import type { FirebaseRoom } from "../../types/firebase";
import { useState } from "react";

interface LobbyWaitProps {
  room: FirebaseRoom;
  localPlayerId: string;
  onStart: () => void;
  onLeave: () => void;
  onToggleReady: () => void;
  onCopyCode: () => void;
  onUpdateSettings?: (settings: Partial<FirebaseRoom["settings"]>) => void;
}

export default function LobbyWait({
  room,
  localPlayerId,
  onStart,
  onLeave,
  onToggleReady,
  onCopyCode,
  onUpdateSettings,
}: LobbyWaitProps) {
  const [showRules, setShowRules] = useState(false);
  const isHost = room.hostId === localPlayerId;
  const me = room.players.find((p) => p.id === localPlayerId);
  const allReady = room.players.every((p) => p.isReady);
  const canStart = room.players.length >= 2 && allReady;

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-gold text-xs uppercase tracking-widest mb-1">Waiting Lobby</p>
          <h1 className="font-display text-3xl font-bold text-ivory">
            Room <span className="text-gold font-display tracking-wider">{room.code}</span>
          </h1>
          <p className="text-sm text-ivory-dim mt-1">
            {room.players.length}/{room.settings.maxPlayers} players · {room.settings.handSize}-card hands
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={onCopyCode}>Copy Code</Button>
          <Button variant="ghost" onClick={() => setShowRules(true)}>Rules</Button>
          <Button variant="ghost" onClick={onLeave}>Leave</Button>
        </div>
      </div>

      <CardPanel title={`Players (${room.players.length}/${room.settings.maxPlayers})`} highlight={canStart}>
        <div className="space-y-3">
          {room.players.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-emerald-dark/50 border border-gold/10">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-display font-bold text-gold">
                  {p.name[0]?.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-ivory font-medium">{p.name}</span>
                  {p.role === "host" && <Badge label="Host" variant="host" />}
                </div>
              </div>
              <Badge label={p.isReady ? "Ready" : "Waiting"} variant={p.isReady ? "turn" : "waiting"} />
            </div>
          ))}
          {Array.from({ length: room.settings.maxPlayers - room.players.length }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg border border-dashed border-gold/15 text-center text-ivory-dim text-sm">
              Waiting for player…
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {!isHost && me && (
            <Button variant="primary" fullWidth onClick={onToggleReady}>
              {me.isReady ? "Unready" : "Ready Up"}
            </Button>
          )}
          {isHost && (
            <Button variant="primary" fullWidth onClick={onStart} disabled={!canStart}>
              {room.players.length < 2 ? "Need 2+ players" : !allReady ? "Waiting for ready" : "Start Game"}
            </Button>
          )}
        </div>
      </CardPanel>

      <GameSettingsModal
        open={showRules}
        onClose={() => setShowRules(false)}
        readOnly={!isHost}
        settings={{
          plus2Stack: room.settings.plus2Stack,
          plus4Stack: room.settings.plus4Stack,
          cardChallengeEnabled: false,
          daxCallEnabled: room.settings.daxCallEnabled,
          afkRule: room.settings.afkRule,
          aiReplacement: room.settings.aiReplacement,
        }}
        onUpdate={(partial) => onUpdateSettings?.(partial)}
      />
    </>
  );
}

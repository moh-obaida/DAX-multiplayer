import { useEffect, useState } from "react";
import { useGameStore } from "../../store/gameStore";
import GameNavbar from "./GameNavbar";
import OpponentSeat from "./OpponentSeat";
import PlayerHand from "./PlayerHand";
import PlayingCard from "./PlayingCard";
import Modal from "../UI/Modal";
import { useToastStore } from "../../store/toastStore";

interface GameTableProps {
  localPlayerId: string;
}

const OPPONENT_POSITIONS = ["top", "left", "right", "top-left", "top-right"] as const;

export default function GameTable({ localPlayerId }: GameTableProps) {
  const game = useGameStore((s) => s.game)!;
  const playCard = useGameStore((s) => s.playCard);
  const drawCard = useGameStore((s) => s.drawCard);
  const callDaxAction = useGameStore((s) => s.callDax);
  const addToast = useToastStore((s) => s.add);

  const [timer, setTimer] = useState(game.turnTimer);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEmotes, setShowEmotes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const localIndex = game.players.findIndex((p) => p.id === localPlayerId);
  const localPlayer = game.players[localIndex];
  const opponents = game.players.filter((p) => p.id !== localPlayerId);
  const isMyTurn = localPlayer?.isCurrentTurn ?? false;
  const topCard = game.discardPile[game.discardPile.length - 1];

  useEffect(() => {
    setTimer(game.turnTimer);
  }, [game.turnTimer, game.currentPlayerIndex]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1 && isMyTurn) {
          drawCard(localPlayerId);
          addToast("Time's up — auto draw", "info");
          return game.settings.turnTimer;
        }
        return t > 0 ? t - 1 : game.settings.turnTimer;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isMyTurn, localPlayerId, drawCard, addToast, game.settings.turnTimer]);

  const handlePlay = (cardId: string) => {
    if (!isMyTurn) return;
    playCard(localPlayerId, cardId);
    setSelectedId(null);
  };

  const handleDraw = () => {
    if (!isMyTurn) return;
    drawCard(localPlayerId);
  };

  const handleDax = () => {
    if (localPlayer?.hand.length === 1) {
      callDaxAction(localPlayerId);
      addToast("DAX! called!", "success");
    } else {
      addToast("You can only call DAX! with one card left", "error");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-emerald-dark overflow-hidden">
      <GameNavbar
        game={game}
        localPlayerId={localPlayerId}
        timer={timer}
        onDaxCall={handleDax}
        onEmotes={() => setShowEmotes(true)}
        onSettings={() => setShowSettings(true)}
      />

      <div className="flex-1 relative dax-felt min-h-0">
        <span className="dax-corner-accent tl opacity-20" />
        <span className="dax-corner-accent tr opacity-20" />
        <span className="dax-corner-accent bl opacity-20" />
        <span className="dax-corner-accent br opacity-20" />

        {opponents.map((p, i) => (
          <OpponentSeat key={p.id} player={p} position={OPPONENT_POSITIONS[i] || "top"} />
        ))}

        {/* Center piles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8 z-20">
          <button type="button" onClick={handleDraw} disabled={!isMyTurn}
            className="flex flex-col items-center gap-2 group disabled:opacity-50">
            <div className="relative">
              <PlayingCard card={{ id: "deck", color: "blue", type: "number", value: 0 }} faceDown size="lg" />
              <span className="absolute -bottom-2 -right-2 bg-gold text-emerald-dark text-xs font-bold px-2 py-0.5 rounded-full font-mono">
                {game.deck.length}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-ivory-dim group-hover:text-gold">Draw</span>
          </button>

          <div className="flex flex-col items-center gap-2">
            {topCard && <PlayingCard card={topCard} size="lg" />}
            <span className="text-[10px] uppercase tracking-widest text-ivory-dim">Discard</span>
          </div>
        </div>

        {/* Direction indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] text-gold/40 text-2xl">
          {game.playDirection === "clockwise" ? "↻" : "↺"}
        </div>
      </div>

      {/* Local hand */}
      <div className={`shrink-0 bg-emerald-dark/90 border-t border-gold/20 ${isMyTurn ? "shadow-[0_-4px_24px_rgba(212,175,55,0.15)]" : ""}`}>
        <div className="text-center py-2">
          <span className="text-xs text-ivory-muted">Your hand · </span>
          <span className="font-display text-gold font-semibold">{localPlayer?.name}</span>
          {isMyTurn && <span className="ml-2 dax-badge text-[10px] animate-pulse">Your turn</span>}
        </div>
        <PlayerHand
          cards={localPlayer?.hand ?? []}
          onPlay={handlePlay}
          selectedId={selectedId}
          isInteractive={isMyTurn}
        />
      </div>

      <Modal open={showEmotes} onClose={() => setShowEmotes(false)} title="Emotes">
        <div className="grid grid-cols-4 gap-2">
          {["👋", "😂", "🔥", "👏", "😤", "🎉", "💪", "🃏"].map((e) => (
            <button key={e} type="button" className="text-2xl p-3 rounded-lg hover:bg-gold/10" onClick={() => { addToast(`Emote sent ${e}`, "info"); setShowEmotes(false); }}>{e}</button>
          ))}
        </div>
      </Modal>

      <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Game Settings">
        <p className="text-sm text-ivory-muted">Sound, colorblind mode, and leave game — configure in <a href="/settings" className="text-gold">Settings</a>.</p>
      </Modal>
    </div>
  );
}

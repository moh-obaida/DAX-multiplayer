import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGameStore } from "../../store/gameStore";
import GameNavbar from "./GameNavbar";
import OpponentSeat from "./OpponentSeat";
import PlayerHand from "./PlayerHand";
import PlayingCard from "./PlayingCard";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { useToastStore } from "../../store/toastStore";

interface GameTableProps {
  localPlayerId: string;
}

const OPPONENT_POSITIONS = ["top", "left", "right", "top-left", "top-right"] as const;

export default function GameTable({ localPlayerId }: GameTableProps) {
  const navigate = useNavigate();
  const game = useGameStore((s) => s.game)!;
  const playCardAction = useGameStore((s) => s.playCard);
  const drawCard = useGameStore((s) => s.drawCard);
  const callDaxAction = useGameStore((s) => s.callDax);
  const runBotTurn = useGameStore((s) => s.runBotTurn);
  const addToast = useToastStore((s) => s.add);

  const [timer, setTimer] = useState(game.turnTimer);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEmotes, setShowEmotes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const localPlayer = game.players.find((p) => p.id === localPlayerId);
  const opponents = game.players.filter((p) => p.id !== localPlayerId);
  const isMyTurn = localPlayer?.isCurrentTurn ?? false;
  const topCard = game.discardPile[game.discardPile.length - 1];
  const isFinished = game.gameStatus === "finished";
  const iWon = isFinished && game.winners.includes(localPlayerId);

  useEffect(() => {
    setTimer(game.turnTimer);
  }, [game.turnTimer, game.currentPlayerIndex]);

  useEffect(() => {
    if (isFinished) return;
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
  }, [isMyTurn, localPlayerId, drawCard, addToast, game.settings.turnTimer, isFinished]);

  useEffect(() => {
    if (isFinished) return;
    const current = game.players[game.currentPlayerIndex];
    if (!current?.isBot) return;

    const timeout = setTimeout(() => runBotTurn(), 800);
    return () => clearTimeout(timeout);
  }, [game.currentPlayerIndex, game.players, runBotTurn, isFinished]);

  const handlePlay = (cardId: string) => {
    if (!isMyTurn || isFinished) return;
    const ok = playCardAction(localPlayerId, cardId);
    if (!ok) {
      addToast("Invalid card — match color, number, or action", "error");
      return;
    }
    setSelectedId(null);
    if (localPlayer?.hand.length === 1) {
      addToast("Don't forget to call DAX! when you have one card left", "info");
    }
  };

  const handleDraw = () => {
    if (!isMyTurn || isFinished) return;
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

      <div className={`flex-1 relative dax-felt min-h-0 ${isMyTurn && !isFinished ? "ring-2 ring-inset ring-gold/20" : ""}`}>
        <span className="dax-corner-accent tl opacity-20" />
        <span className="dax-corner-accent tr opacity-20" />
        <span className="dax-corner-accent bl opacity-20" />
        <span className="dax-corner-accent br opacity-20" />

        {opponents.map((p, i) => (
          <OpponentSeat key={p.id} player={p} position={OPPONENT_POSITIONS[i] || "top"} />
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8 z-20">
          <button type="button" onClick={handleDraw} disabled={!isMyTurn || isFinished}
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

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120%] text-gold/40 text-2xl">
          {game.playDirection === "clockwise" ? "↻" : "↺"}
        </div>
      </div>

      <div className={`shrink-0 bg-emerald-dark/90 border-t border-gold/20 ${isMyTurn && !isFinished ? "shadow-[0_-4px_24px_rgba(212,175,55,0.2)]" : ""}`}>
        <div className="text-center py-2">
          <span className="text-xs text-ivory-muted">Your hand · </span>
          <span className="font-display text-gold font-semibold">{localPlayer?.name}</span>
          {isMyTurn && !isFinished && <span className="ml-2 dax-badge text-[10px] animate-pulse">Your turn</span>}
        </div>
        <PlayerHand
          cards={localPlayer?.hand ?? []}
          onPlay={handlePlay}
          selectedId={selectedId}
          isInteractive={isMyTurn && !isFinished}
        />
      </div>

      {isFinished && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="dax-panel-glow p-8 max-w-md mx-4 text-center border border-gold/40">
            <p className="text-gold text-xs uppercase tracking-[0.3em] mb-2">Game Over</p>
            <h2 className="font-display text-3xl font-bold text-ivory mb-2">
              {iWon ? "You Win!" : "Match Finished"}
            </h2>
            <p className="text-ivory-muted text-sm mb-6">
              {iWon
                ? "You emptied your hand first. Great game!"
                : `Winner: ${game.players.find((p) => p.id === game.winners[0])?.name ?? "Unknown"}`}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" onClick={() => navigate("/game/demo")}>Play Again</Button>
              <Button variant="secondary" to="/">Main Menu</Button>
              <Button variant="ghost" to="/play">Lobby</Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={showEmotes} onClose={() => setShowEmotes(false)} title="Emotes">
        <div className="grid grid-cols-4 gap-2">
          {["👋", "😂", "🔥", "👏", "😤", "🎉", "💪", "🃏"].map((e) => (
            <button key={e} type="button" className="text-2xl p-3 rounded-lg hover:bg-gold/10" onClick={() => { addToast(`Emote sent ${e}`, "info"); setShowEmotes(false); }}>{e}</button>
          ))}
        </div>
      </Modal>

      <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Game Settings">
        <p className="text-sm text-ivory-muted mb-4">Adjust audio and accessibility in Settings.</p>
        <Link to="/settings" className="text-gold hover:underline text-sm">Open Settings →</Link>
      </Modal>
    </div>
  );
}

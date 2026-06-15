import { useState, useEffect } from "react";
import { Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { PlayerSeatPosition } from "../../types/ui";
import { useGame } from "../../hooks/useGame";
import { useTimer } from "../../hooks/useTimer";
import { useToastStore } from "../../store/toastStore";
import TurnTimer from "./TurnTimer";
import PlayerArea from "./PlayerArea";
import CardHand from "./CardHand";
import DiscardPile from "./DiscardPile";
import DrawDeck from "./DrawDeck";
import UNOButton from "./UNOButton";
import WildColorPicker from "../Modals/WildColorPicker";
import GameEnd from "../Modals/GameEnd";
import GameSettingsModal from "../Modals/GameSettingsModal";
import EmoteMenu from "../Common/EmoteMenu";
import { useGameStore } from "../../store/gameStore";
import { runBotTurn } from "../../utils/botAI";

interface GameBoardProps {
  localPlayerId: string;
  roomCode?: string;
  onRematch?: () => void;
}

const SEAT_POSITIONS: PlayerSeatPosition[] = ["top", "left", "right", "top-left"];

export default function GameBoard({ localPlayerId, roomCode, onRematch }: GameBoardProps) {
  const {
    game,
    localPlayer,
    isMyTurn,
    topCard,
    isFinished,
    playCard,
    drawCard,
    callUno,
    callOutUno,
    pickWildColor,
    sendEmote,
    handleAfk,
  } = useGame(localPlayerId);

  const addToast = useToastStore((s) => s.add);
  const [showSettings, setShowSettings] = useState(false);
  const updateGameState = useGameStore((s) => s.updateGameState);

  useEffect(() => {
    if (!game || isFinished) return;
    const current = game.players[game.currentPlayerIndex];
    if (!current?.isBot) return;
    const timeout = setTimeout(() => {
      const next = runBotTurn(game);
      updateGameState(next);
    }, 800);
    return () => clearTimeout(timeout);
  }, [game, isFinished, updateGameState]);

  const timer = useTimer({
    isActive: isMyTurn && !isFinished,
    resetKey: game?.currentPlayerIndex,
    onExpire: () => {
      if (isMyTurn) {
        handleAfk(localPlayerId);
        addToast("Time's up — turn skipped", "info");
      }
    },
  });

  if (!game) return null;

  const opponents = game.players.filter((p) => p.id !== localPlayerId);
  const canCallUno = (localPlayer?.hand.length ?? 0) === 1;
  const showWildPicker =
    game.pendingWildPick?.playerId === localPlayerId && isMyTurn;

  const handleUno = () => {
    if (localPlayer?.hand.length === 1) {
      callUno();
      addToast("UNO! called", "success");
    } else if ((localPlayer?.hand.length ?? 0) === 2) {
      addToast("Wait until you have 1 card, then play UNO!", "info");
    } else {
      addToast("You can only call UNO with one card left", "error");
    }
  };

  const handlePlay = (cardId: string) => {
    const card = localPlayer?.hand.find((c) => c.id === cardId);
    if (!card) return;
    const ok = playCard(cardId);
    if (!ok) {
      addToast("Invalid card — match color, number, or action", "error");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-emerald overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2 bg-emerald-dark border-b border-gold/15">
        <Link to={roomCode ? `/room/${roomCode}` : "/play"} className="flex items-center gap-2 text-ivory-dim hover:text-gold text-sm">
          <ArrowLeft size={16} />
          Lobby
        </Link>
        <span className="font-display text-gold font-bold tracking-wider">DAX</span>
        <button type="button" onClick={() => setShowSettings(true)} aria-label="Game settings" className="text-ivory-dim hover:text-gold">
          <Settings size={20} />
        </button>
      </header>

      <TurnTimer timer={timer} />

      <div className={`flex-1 relative dax-felt min-h-0 ${isMyTurn && !isFinished ? "ring-2 ring-inset ring-gold/20" : ""}`}>
        {opponents.map((p, i) => (
          <PlayerArea
            key={p.id}
            player={p}
            position={SEAT_POSITIONS[i] ?? "top"}
            isLocal={false}
            canCallOut={!isMyTurn && p.hand.length === 1 && !p.hasCalledUno}
            onCallOut={() => {
              callOutUno(p.id);
              addToast(`Called out ${p.name}!`, "success");
            }}
          />
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-10 z-20">
          <DrawDeck count={game.deck.length} onDraw={drawCard} disabled={!isMyTurn || isFinished} />
          <DiscardPile topCard={topCard} activeColor={game.activeColor} />
        </div>

        {game.spectatorCount > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-1 text-ivory-dim text-sm">
            <span>👁️</span>
            <span>{game.spectatorCount}</span>
          </div>
        )}

        {game.messages.length > 0 && (
          <div className="absolute bottom-48 left-4 max-w-xs space-y-1 pointer-events-none">
            {game.messages.slice(-3).map((m) => (
              <p key={m.id} className="text-xs text-ivory/80 bg-black/40 rounded px-2 py-1">
                <span className="text-gold">{m.playerName}:</span> {m.content}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className={`shrink-0 bg-emerald-dark/95 border-t border-gold/20 ${isMyTurn && !isFinished ? "shadow-[0_-4px_24px_rgba(212,175,55,0.2)]" : ""}`}>
        <div className="flex items-center justify-between px-4 py-2">
          <div>
            <span className="text-xs text-ivory-muted">Your hand · </span>
            <span className="font-display text-gold font-semibold">{localPlayer?.name}</span>
          </div>
          <UNOButton onClick={handleUno} canCall={canCallUno} disabled={isFinished} />
        </div>
        <CardHand
          cards={localPlayer?.hand ?? []}
          onPlay={handlePlay}
          isInteractive={isMyTurn && !isFinished && !showWildPicker}
        />
      </div>

      {showWildPicker && game.pendingWildPick && (
        <WildColorPicker
          deadline={game.pendingWildPick.deadline}
          onSelect={(color) => pickWildColor(localPlayerId, game.pendingWildPick!.cardId, color)}
          onTimeout={() => pickWildColor(localPlayerId, game.pendingWildPick!.cardId, "red")}
        />
      )}

      {isFinished && <GameEnd game={game} localPlayerId={localPlayerId} onRematch={onRematch} />}

      <GameSettingsModal open={showSettings} onClose={() => setShowSettings(false)} settings={game.settings.houseRules} />

      <EmoteMenu playerId={localPlayerId} playerName={localPlayer?.name ?? "Player"} onSend={sendEmote} disabled={isFinished} />
    </div>
  );
}

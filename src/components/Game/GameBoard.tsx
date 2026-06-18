import { lazy, Suspense, useState, useEffect } from "react";
import { Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useGame } from "../../hooks/useGame";
import { useTimer } from "../../hooks/useTimer";
import { useToastStore } from "../../store/toastStore";
import { copy } from "../../lib/copy";
import TurnTimer from "./TurnTimer";
import PlayerArea from "./PlayerArea";
import CardHand from "./CardHand";
import DiscardPile from "./DiscardPile";
import DrawDeck from "./DrawDeck";
import UNOButton from "./UNOButton";
import GameSettingsModal from "../Modals/GameSettingsModal";
import EmoteMenu from "../Common/EmoteMenu";
import { useGameStore } from "../../store/gameStore";
import { runBotTurn } from "../../utils/botAI";
import { UI } from "../../lib/timing";
import { getOpponentSeatStyles } from "../../utils/seatLayout";

const WildColorPicker = lazy(() => import("../Modals/WildColorPicker"));
const GameEnd = lazy(() => import("../Modals/GameEnd"));

interface GameBoardProps {
  localPlayerId: string;
  roomCode?: string;
  onRematch?: () => void;
  connected?: boolean;
}

export default function GameBoard({ localPlayerId, roomCode, onRematch, connected = true }: GameBoardProps) {
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
    }, UI.GAME_BOARD_MOUNT_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [game, isFinished, updateGameState]);

  const timer = useTimer({
    isActive: isMyTurn && !isFinished,
    resetKey: game?.currentPlayerIndex,
    onExpire: () => {
      if (isMyTurn) {
        handleAfk(localPlayerId);
        addToast(copy.toast.timeUp, "info");
      }
    },
  });

  if (!game) return null;

  const opponents = game.players.filter((p) => p.id !== localPlayerId);
  const seatStyles = getOpponentSeatStyles(opponents.length);
  const canCallUno = (localPlayer?.hand.length ?? 0) === 1;
  const showWildPicker =
    game.pendingWildPick?.playerId === localPlayerId && isMyTurn;

  const handleUno = () => {
    if (localPlayer?.hand.length === 1) {
      callUno();
      addToast(copy.toast.unoCalled, "success");
    } else if ((localPlayer?.hand.length ?? 0) === 2) {
      addToast(copy.toast.unoEarly, "info");
    } else {
      addToast(copy.toast.unoOnlyOne, "error");
    }
  };

  const handlePlay = (cardId: string) => {
    if (!localPlayer?.hand.find((c) => c.id === cardId)) return;
    const ok = playCard(cardId);
    if (!ok) addToast(copy.toast.invalidCard, "error");
  };

  return (
    <div className="h-screen flex flex-col bg-emerald overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2 bg-emerald-dark border-b border-gold/15">
        <Link to={roomCode ? `/room/${roomCode}` : "/"} className="flex items-center gap-2 text-ivory-dim hover:text-gold text-sm">
          <ArrowLeft size={16} />
          Lobby
        </Link>
        <img src="/logos/dax-wordmark.png" alt="DAX" className="h-5 w-auto" />
        <button type="button" onClick={() => setShowSettings(true)} aria-label="Game settings" className="text-ivory-dim hover:text-gold">
          <Settings size={20} />
        </button>
      </header>

      <TurnTimer timer={timer} />

      {!connected && roomCode && (
        <div className="bg-red/20 border-b border-red/40 px-4 py-1.5 text-center text-xs text-red-200">
          {copy.toast.connectionLost}
        </div>
      )}

      <div className={`flex-1 relative dax-felt min-h-0 overflow-hidden ${isMyTurn && !isFinished ? "ring-2 ring-inset ring-gold/20" : ""}`}>
        {opponents.map((p, i) => (
          <PlayerArea
            key={p.id}
            player={p}
            seatStyle={seatStyles[i]}
            isLocal={false}
            canCallOut={!isMyTurn && p.hand.length === 1 && !p.hasCalledUno}
            onCallOut={() => {
              callOutUno(p.id);
              addToast(copy.toast.unoCalledOut(p.name), "success");
            }}
          />
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-10 z-20">
          <DrawDeck count={game.deck.length} onDraw={drawCard} disabled={!isMyTurn || isFinished} />
          <DiscardPile topCard={topCard} activeColor={game.activeColor} />
        </div>

        {game.spectatorCount > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-1 text-ivory-dim text-sm">
            <span aria-hidden>👁</span>
            <span className="tabular-nums dax-tnum">{game.spectatorCount}</span>
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
        <Suspense fallback={null}>
          <WildColorPicker
            deadline={game.pendingWildPick.deadline}
            onSelect={(color) => pickWildColor(localPlayerId, game.pendingWildPick!.cardId, color)}
            onTimeout={() => pickWildColor(localPlayerId, game.pendingWildPick!.cardId, "red")}
          />
        </Suspense>
      )}

      {isFinished && (
        <Suspense fallback={null}>
          <GameEnd game={game} localPlayerId={localPlayerId} onRematch={onRematch} />
        </Suspense>
      )}

      <GameSettingsModal open={showSettings} onClose={() => setShowSettings(false)} settings={game.settings.houseRules} />

      <EmoteMenu playerId={localPlayerId} playerName={localPlayer?.name ?? "Player"} onSend={sendEmote} disabled={isFinished} />
    </div>
  );
}

import { useCallback } from "react";
import { useGameStore } from "../store/gameStore";
import type { CardColor } from "../types/game";

export function useGame(localPlayerId: string) {
  const game = useGameStore((s) => s.game);
  const playCardAction = useGameStore((s) => s.playCard);
  const drawCardAction = useGameStore((s) => s.drawCard);
  const callUnoAction = useGameStore((s) => s.callUno);
  const callOutUnoAction = useGameStore((s) => s.callOutUno);
  const pickWildColor = useGameStore((s) => s.pickWildColor);
  const sendEmote = useGameStore((s) => s.sendEmote);
  const handleAfk = useGameStore((s) => s.handleAfk);
  const isAnimating = useGameStore((s) => s.isAnimating);

  const localPlayer = game?.players.find((p) => p.id === localPlayerId);
  const isMyTurn = localPlayer?.isCurrentTurn ?? false;
  const topCard = game?.discardPile[game.discardPile.length - 1];
  const isFinished = game?.gameStatus === "finished";

  const playCard = useCallback(
    (cardId: string, color?: CardColor) => playCardAction(localPlayerId, cardId, color),
    [localPlayerId, playCardAction]
  );

  const drawCard = useCallback(() => drawCardAction(localPlayerId), [localPlayerId, drawCardAction]);
  const callUno = useCallback(() => callUnoAction(localPlayerId), [localPlayerId, callUnoAction]);
  const callOutUno = useCallback(
    (targetId: string) => callOutUnoAction(localPlayerId, targetId),
    [localPlayerId, callOutUnoAction]
  );

  return {
    game,
    localPlayer,
    isMyTurn,
    topCard,
    isFinished,
    isAnimating,
    playCard,
    drawCard,
    callUno,
    callOutUno,
    pickWildColor,
    sendEmote,
    handleAfk,
  };
}

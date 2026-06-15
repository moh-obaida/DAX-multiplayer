import { useEffect, useRef } from "react";
import { subscribeRoom, submitPlay } from "../lib/firebase";
import { firebaseToGameState } from "../lib/gameLogic";
import { useGameStore } from "../store/gameStore";

export function useMultiplayer(roomCode: string | undefined, localPlayerId: string, isHost: boolean) {
  const setGameFromRemote = useGameStore((s) => s.setGameFromRemote);
  const game = useGameStore((s) => s.game);
  const syncing = useRef(false);

  useEffect(() => {
    if (!roomCode) return;

    const unsub = subscribeRoom(roomCode, (room) => {
      if (!room?.gameState) return;
      const remote = firebaseToGameState(room);
      if (!remote) return;
      if (syncing.current) return;
      setGameFromRemote(remote, localPlayerId);
    });

    return unsub;
  }, [roomCode, localPlayerId, setGameFromRemote]);

  useEffect(() => {
    if (!roomCode || !game || !isHost) return;
    if (game.gameStatus !== "playing" && game.gameStatus !== "finished") return;

    const sync = async () => {
      syncing.current = true;
      try {
        await submitPlay(roomCode, game);
      } finally {
        syncing.current = false;
      }
    };

    const timeout = setTimeout(sync, 100);
    return () => clearTimeout(timeout);
  }, [roomCode, game, isHost]);
}

import { useEffect, useRef, useState } from "react";
import { subscribeRoom, submitPlay, isFirebaseConfigured } from "../lib/firebase";
import { firebaseToGameState } from "../lib/gameLogic";
import { useGameStore } from "../store/gameStore";
import { useToastStore } from "../store/toastStore";
import { copy } from "../lib/copy";

export function useMultiplayer(roomCode: string | undefined, localPlayerId: string, isHost: boolean) {
  const setGameFromRemote = useGameStore((s) => s.setGameFromRemote);
  const game = useGameStore((s) => s.game);
  const addToast = useToastStore((s) => s.add);
  const syncing = useRef(false);
  const hadRoom = useRef(false);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    if (!roomCode) return;

    const unsub = subscribeRoom(roomCode, (room) => {
      if (!room) {
        if (hadRoom.current && isFirebaseConfigured) {
          setConnected(false);
          addToast(copy.toast.connectionLost, "error");
        }
        return;
      }
      hadRoom.current = true;
      setConnected(true);
      if (!room.gameState) return;
      const remote = firebaseToGameState(room);
      if (!remote) return;
      if (syncing.current) return;
      setGameFromRemote(remote, localPlayerId);
    });

    return unsub;
  }, [roomCode, localPlayerId, setGameFromRemote, addToast]);

  useEffect(() => {
    if (!roomCode || !game || !isHost) return;
    if (game.gameStatus !== "playing" && game.gameStatus !== "finished") return;

    const sync = async () => {
      syncing.current = true;
      try {
        await submitPlay(roomCode, game);
      } catch {
        addToast(copy.toast.connectionLost, "error");
      } finally {
        syncing.current = false;
      }
    };

    const timeout = setTimeout(sync, 100);
    return () => clearTimeout(timeout);
  }, [roomCode, game, isHost, addToast]);

  return { connected };
}

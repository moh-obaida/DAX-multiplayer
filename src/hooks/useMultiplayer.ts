import { useEffect, useRef, useState } from "react";
import { subscribeRoom, submitPlay, isFirebaseConfigured } from "../lib/firebase";
import { firebaseToGameState } from "../lib/gameLogic";
import { useGameStore } from "../store/gameStore";
import { useToastStore } from "../store/toastStore";
import { copy } from "../lib/copy";
import { UI } from "../lib/timing";
import type { GameState } from "../types/game";

export function useMultiplayer(roomCode: string | undefined, localPlayerId: string, isHost: boolean) {
  const setGameFromRemote = useGameStore((s) => s.setGameFromRemote);
  const game = useGameStore((s) => s.game);
  const addToast = useToastStore((s) => s.add);
  const syncing = useRef(false);
  const pendingRemote = useRef<GameState | null>(null);
  const hadRoom = useRef(false);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    if (!roomCode || !localPlayerId) return;

    const applyRemote = (remote: GameState) => {
      if (syncing.current) {
        pendingRemote.current = remote;
        return;
      }
      setGameFromRemote(remote, localPlayerId);
    };

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
      applyRemote(remote);
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
        const pending = pendingRemote.current;
        if (pending) {
          pendingRemote.current = null;
          setGameFromRemote(pending, localPlayerId);
        }
      }
    };

    const timeout = setTimeout(sync, UI.MULTIPLAYER_SYNC_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [roomCode, game, isHost, localPlayerId, addToast, setGameFromRemote]);

  return { connected };
}

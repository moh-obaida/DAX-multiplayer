import { useEffect, useState } from "react";
import { resolvePlayerId } from "../lib/playerId";

export function usePlayerId(): string | null {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void resolvePlayerId().then((id) => {
      if (!cancelled) setPlayerId(id);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return playerId;
}

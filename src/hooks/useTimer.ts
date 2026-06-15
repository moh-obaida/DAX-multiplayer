import { useEffect, useState, useCallback } from "react";
import type { TimerState } from "../types/ui";
import { TURN_TIMER_SECONDS } from "../lib/constants";

interface UseTimerOptions {
  total?: number;
  isActive: boolean;
  onExpire: () => void;
  resetKey?: string | number;
}

export function useTimer({ total = TURN_TIMER_SECONDS, isActive, onExpire, resetKey }: UseTimerOptions) {
  const [remaining, setRemaining] = useState(total);

  useEffect(() => {
    setRemaining(total);
  }, [resetKey, total]);

  useEffect(() => {
    if (!isActive) return;

    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          onExpire();
          return total;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isActive, onExpire, total, resetKey]);

  const state: TimerState = {
    remaining,
    total,
    phase: remaining <= 5 ? "red" : remaining <= 15 ? "yellow" : "green",
    isFlashing: remaining <= 5,
  };

  const reset = useCallback(() => setRemaining(total), [total]);

  return { ...state, reset };
}

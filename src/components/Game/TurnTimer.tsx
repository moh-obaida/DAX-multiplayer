import type { TimerState } from "../../types/ui";
import { copy } from "../../lib/copy";

interface TurnTimerProps {
  timer: TimerState;
}

export default function TurnTimer({ timer }: TurnTimerProps) {
  const pct = (timer.remaining / timer.total) * 100;

  return (
    <div
      className="w-full px-4 py-2 bg-emerald-dark/80 border-b border-gold/15"
      role="timer"
      aria-label={`${copy.labels.turnTimer}: ${timer.remaining} seconds`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-widest text-ivory-dim">{copy.labels.turnTimer}</span>
        <span className={`font-display font-bold tabular-nums dax-tnum ${timer.isFlashing ? "text-red animate-pulse" : "text-gold"}`}>
          {timer.remaining}s
        </span>
      </div>
      <div className="h-2 rounded-full bg-black/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${timer.isFlashing ? "animate-pulse" : ""}`}
          style={{
            width: `${pct}%`,
            background: timer.phase === "red"
              ? "var(--dax-timer-urgent)"
              : timer.phase === "yellow"
                ? "var(--dax-timer-mid)"
                : "var(--dax-timer-safe)",
          }}
        />
      </div>
    </div>
  );
}

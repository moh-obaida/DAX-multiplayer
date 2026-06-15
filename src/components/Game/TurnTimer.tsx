import type { TimerState } from "../../types/ui";

interface TurnTimerProps {
  timer: TimerState;
}

export default function TurnTimer({ timer }: TurnTimerProps) {
  const pct = (timer.remaining / timer.total) * 100;
  const barColor =
    timer.phase === "red" ? "bg-red" : timer.phase === "yellow" ? "bg-yellow" : "bg-green";

  return (
    <div className="w-full px-4 py-2 bg-emerald-dark/80 border-b border-gold/15" role="timer" aria-label={`${timer.remaining} seconds remaining`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-widest text-ivory-dim">Turn Timer</span>
        <span className={`font-display font-bold tabular-nums ${timer.isFlashing ? "text-red animate-pulse" : "text-gold"}`}>
          {timer.remaining}s
        </span>
      </div>
      <div className="h-2 rounded-full bg-black/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor} ${timer.isFlashing ? "animate-pulse" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

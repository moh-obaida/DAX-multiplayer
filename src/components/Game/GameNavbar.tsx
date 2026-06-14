import type { GameState } from "../../types/game";
import { Link } from "react-router-dom";
import DaxBrand from "../UI/DaxBrand";
import { DAX_RULES } from "../../config/daxRules";

interface GameNavbarProps {
  game: GameState;
  localPlayerId: string;
  timer: number;
  onDaxCall: () => void;
  onEmotes: () => void;
  onSettings: () => void;
}

export default function GameNavbar({ game, localPlayerId, timer, onDaxCall, onEmotes, onSettings }: GameNavbarProps) {
  const current = game.players[game.currentPlayerIndex];
  const timerPct = (timer / game.settings.turnTimer) * 100;
  const timerColor = timer > 20 ? "bg-green" : timer > 10 ? "bg-yellow" : "bg-red";

  return (
    <header className="shrink-0 z-50 bg-emerald-dark/95 backdrop-blur-xl border-b border-gold/20">
      <div className="h-14 px-4 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0 opacity-80 hover:opacity-100"><DaxBrand size="sm" showWordmark={false} /></Link>

        <div className="flex-1 max-w-md mx-auto text-center hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-ivory-dim">Current Turn</p>
          <p className={`font-display font-semibold ${current?.id === localPlayerId ? "text-gold" : "text-ivory"}`}>
            {current?.name}{current?.id === localPlayerId ? " (You)" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-board/60 border border-gold/15">
            <span className="font-display text-lg font-bold tabular-nums text-ivory">{timer}s</span>
            <div className="w-16 h-1.5 rounded-full bg-emerald-dark overflow-hidden">
              <div className={`h-full ${timerColor} transition-all`} style={{ width: `${timerPct}%` }} />
            </div>
          </div>
          <button type="button" onClick={onDaxCall} className="dax-btn-primary !px-3 !py-1.5 !text-xs">{DAX_RULES.callLabel}</button>
          <button type="button" onClick={onEmotes} className="dax-btn-secondary !px-3 !py-1.5 !text-xs hidden sm:inline-flex">Emotes</button>
          <button type="button" onClick={onSettings} className="text-ivory-muted hover:text-gold p-2" aria-label="Settings">⚙</button>
        </div>
      </div>
    </header>
  );
}

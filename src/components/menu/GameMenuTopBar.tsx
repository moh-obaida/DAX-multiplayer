import { Link } from "react-router-dom";
import DaxBrand from "../UI/DaxBrand";
import { useAuthStore } from "../../store/authStore";

export default function GameMenuTopBar() {
  const user = useAuthStore((s) => s.user);
  const username = user?.username ?? "Guest";
  const wins = user?.stats.wins ?? 0;
  const streak = user?.stats.currentStreak ?? 0;
  const level = Math.max(1, Math.floor((user?.stats.totalGames ?? 0) / 5) + 1);
  const xp = ((user?.stats.totalGames ?? 0) % 5) * 20;

  return (
    <header className="relative z-20 shrink-0 px-3 sm:px-5 pt-3 pb-2">
      <div className="flex items-center justify-between gap-3">
        {/* Player HUD — left */}
        <Link to={user ? "/profile" : "/login"} className="game-hud-panel flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-board border-2 border-gold/40 flex items-center justify-center font-display font-bold text-gold text-sm shadow-gold-sm">
              {username[0]?.toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green border-2 border-emerald-dark shadow-[0_0_6px_rgba(67,160,71,0.8)]" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="text-sm font-semibold text-ivory truncate">{username}</p>
            <p className="text-[10px] text-green uppercase tracking-wider font-medium">Online</p>
          </div>
        </Link>

        {/* Center — DAX mark */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none opacity-90 hidden sm:block">
          <DaxBrand size="sm" showWordmark={false} />
        </div>
        <p className="sm:hidden font-display text-xs uppercase tracking-[0.25em] text-gold/80 absolute left-1/2 -translate-x-1/2">
          Main Menu
        </p>

        {/* Stats HUD — right */}
        <div className="game-hud-panel flex items-center gap-1 sm:gap-2 px-2 py-1.5">
          <StatPill icon="🏆" value={wins} label="Wins" />
          <StatPill icon="🔥" value={streak} label="Streak" hideMobile />
          <StatPill icon="⭐" value={`L${level}`} sub={`${xp}%`} label="Level" hideMobile />
          <button
            type="button"
            className="relative w-9 h-9 rounded-lg border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition-all flex items-center justify-center text-sm"
            aria-label="Notifications"
          >
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red border border-emerald-dark" />
          </button>
        </div>
      </div>
      <div className="dax-gold-line mt-2 opacity-30" />
    </header>
  );
}

function StatPill({
  icon,
  value,
  sub,
  label,
  hideMobile,
}: {
  icon: string;
  value: string | number;
  sub?: string;
  label: string;
  hideMobile?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-dark/60 border border-gold/10 ${hideMobile ? "hidden md:flex" : "flex"}`}
      title={label}
    >
      <span className="text-sm">{icon}</span>
      <div className="leading-none">
        <span className="font-display text-xs font-bold text-gold tabular-nums">{value}</span>
        {sub && <span className="text-[9px] text-ivory-dim ml-0.5">{sub}</span>}
      </div>
    </div>
  );
}

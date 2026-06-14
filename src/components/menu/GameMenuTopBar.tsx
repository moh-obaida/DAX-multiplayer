import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import DaxBrand from "../UI/DaxBrand";
import { useAuthStore } from "../../store/authStore";
import { useFriendsStore } from "../../store/friendsStore";

export default function GameMenuTopBar() {
  const user = useAuthStore((s) => s.user);
  const friends = useFriendsStore((s) => s.friends);
  const onlineFriends = friends.filter((f) => f.status === "online").length;

  const username = user?.username ?? "Guest";
  const wins = user?.stats.wins ?? 0;
  const streak = user?.stats.currentStreak ?? 0;
  const level = Math.max(1, Math.floor((user?.stats.totalGames ?? 0) / 5) + 1);
  const xp = ((user?.stats.totalGames ?? 0) % 5) * 20;

  return (
    <header className="relative z-20 shrink-0">
      <div className="menu-container px-4 pt-3 pb-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left — player */}
          <Link
            to={user ? "/profile" : "/login"}
            className="game-hud-panel flex items-center gap-2.5 pl-1.5 pr-3 py-2 min-w-0 max-w-[40%] sm:max-w-none"
          >
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-xl bg-board border-2 border-gold/50 flex items-center justify-center font-display font-bold text-gold shadow-gold-sm">
                {username[0]?.toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green border-2 border-emerald-dark" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ivory truncate">{username}</p>
              <p className="text-[10px] text-green font-medium uppercase tracking-wider">Online</p>
            </div>
          </Link>

          {/* Center — DAX identity */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 shrink-0 hover:opacity-90 transition-opacity">
            <DaxBrand size="xl" showWordmark />
          </Link>

          {/* Right — stats */}
          <div className="game-hud-panel flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1.5 max-w-[48%] sm:max-w-none overflow-hidden">
            <StatBadge label="Wins" value={wins} icon={<TrophyIcon />} />
            <StatBadge label="Streak" value={streak} icon={<FlameIcon />} hideSm />
            <StatBadge label="Level" value={`L${level}`} sub={`${xp}%`} icon={<StarIcon />} hideSm />
            <Link
              to="/friends"
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-dark/50 border border-gold/15 hover:border-gold/40 transition-colors"
              title="Friends online"
            >
              <span className="dax-status-online" />
              <span className="text-[10px] text-gold font-mono font-bold">{onlineFriends}</span>
            </Link>
            <button
              type="button"
              className="relative w-9 h-9 shrink-0 rounded-lg border border-gold/30 bg-emerald-dark/40 hover:bg-gold/10 hover:border-gold/50 transition-all flex items-center justify-center"
              aria-label="Notifications"
            >
              <BellIcon />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red border border-emerald-dark" />
            </button>
          </div>
        </div>
      </div>
      <div className="dax-gold-line opacity-35" />
    </header>
  );
}

function StatBadge({
  label,
  value,
  sub,
  icon,
  hideSm,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  hideSm?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg border border-gold/15 bg-emerald-dark/50 ${hideSm ? "hidden sm:flex" : "flex"}`}
      title={label}
    >
      <span className="text-gold/80 w-4 h-4 flex items-center justify-center shrink-0">{icon}</span>
      <div className="leading-none min-w-0">
        <span className="font-display text-[11px] sm:text-xs font-bold text-gold tabular-nums">{value}</span>
        {sub && <span className="text-[8px] text-ivory-dim ml-0.5">{sub}</span>}
      </div>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 4h8v3a4 4 0 01-8 0V4zM6 4H4v1a3 3 0 003 3M18 4h2v1a3 3 0 01-3 3M12 11v3M9 19h6" strokeLinecap="round" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3c2 4 4 5 4 9a4 4 0 01-8 0c0-3 1.5-4.5 4-9z" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l2.4 5.8L21 10l-4.5 4.2L18 21l-6-3.5L6 21l1.5-6.8L3 10l6.6-1.2L12 3z" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
      <path d="M18 16v-5a6 6 0 00-12 0v5l-2 2h16l-2-2zM10 20a2 2 0 004 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

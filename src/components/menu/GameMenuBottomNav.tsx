import { Link, useLocation } from "react-router-dom";
import { getHelpUrl } from "../../utils/urls";
import type { ComponentType } from "react";

type NavId = "home" | "play" | "friends" | "achievements" | "rules" | "profile" | "settings";

interface NavItem {
  id: NavId;
  label: string;
  icon: ComponentType<{ active: boolean }>;
  to?: string;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", to: "/", icon: HomeIcon },
  { id: "play", label: "Play", to: "/play", icon: PlayIcon },
  { id: "friends", label: "Friends", to: "/friends", icon: FriendsIcon },
  { id: "achievements", label: "Badges", to: "/profile", icon: TrophyIcon },
  { id: "rules", label: "Rules", href: getHelpUrl(), icon: BookIcon },
  { id: "profile", label: "Profile", to: "/profile", icon: UserIcon },
  { id: "settings", label: "Settings", to: "/settings", icon: GearIcon },
];

interface Props {
  active: NavId;
}

export default function GameMenuBottomNav({ active }: Props) {
  const location = useLocation();

  return (
    <nav className="relative z-20 shrink-0 game-bottom-nav px-2 sm:px-4 pb-3 pt-2">
      <div className="dax-gold-line mb-2 opacity-25" />
      <div className="flex items-end justify-around gap-0.5 sm:gap-1 max-w-4xl mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active || (item.to && location.pathname === item.to);
          const Icon = item.icon;
          const className = `game-nav-btn flex flex-col items-center gap-0.5 min-w-[52px] sm:min-w-[64px] py-1.5 px-1 rounded-xl transition-all
            ${isActive ? "text-gold bg-gold/10 shadow-gold-sm scale-105" : "text-ivory-dim hover:text-ivory hover:bg-white/5"}`;

          if (item.href) {
            return (
              <a key={item.id} href={item.href} className={className}>
                <Icon active={false} />
                <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
              </a>
            );
          }

          return (
            <Link key={item.id} to={item.to!} className={className}>
              <Icon active={!!isActive} />
              <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-gold" : "text-current"}>
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-gold" : "text-current"}>
      <rect x="3" y="5" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 8l6 4-6 4V8z" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function FriendsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-gold" : "text-current"}>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 19c0-2 1.5-3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrophyIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-gold" : "text-current"}>
      <path d="M8 4h8v3a4 4 0 01-8 0V4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 4H4v1a3 3 0 003 3M18 4h2v1a3 3 0 01-3 3M12 11v3M9 19h6M10 14h4v5H10v-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-gold" : "text-current"}>
      <path d="M5 4h9a3 3 0 013 3v14a2 2 0 00-2-2H5a2 2 0 00-2 2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h6M9 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-gold" : "text-current"}>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={active ? "text-gold" : "text-current"}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

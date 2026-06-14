import type { ReactNode } from "react";
import GameMenuTopBar from "./GameMenuTopBar";
import GameMenuBottomNav from "./GameMenuBottomNav";
import GameMenuSideRail from "./GameMenuSideRail";

interface GameMenuShellProps {
  children: ReactNode;
  activeNav?: "home" | "play" | "friends" | "achievements" | "rules" | "profile" | "settings";
}

export default function GameMenuShell({ children, activeNav = "home" }: GameMenuShellProps) {
  return (
    <div className="game-menu-screen fixed inset-0 z-50 flex flex-col bg-emerald-dark overflow-hidden">
      <div className="absolute inset-0 game-menu-bg pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(26,58,46,0.5)_0%,transparent_70%)] pointer-events-none" />

      <GameMenuTopBar />
      <GameMenuSideRail />

      <main className="relative flex-1 flex flex-col min-h-0 z-10">{children}</main>

      <GameMenuBottomNav active={activeNav} />
    </div>
  );
}

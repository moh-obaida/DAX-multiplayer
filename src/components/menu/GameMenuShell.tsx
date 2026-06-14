import type { ReactNode } from "react";
import GameMenuTopBar from "./GameMenuTopBar";
import GameMenuBottomNav from "./GameMenuBottomNav";
import GameMenuBackground from "./GameMenuBackground";

interface GameMenuShellProps {
  children: ReactNode;
  activeNav?: "home" | "play" | "friends" | "achievements" | "rules" | "profile" | "settings";
}

export default function GameMenuShell({ children, activeNav = "home" }: GameMenuShellProps) {
  return (
    <div className="game-menu-screen fixed inset-0 z-50 flex flex-col bg-emerald-dark overflow-hidden">
      <div className="absolute inset-0 game-menu-bg pointer-events-none" />
      <GameMenuBackground />

      <GameMenuTopBar />

      <main className="relative flex-1 flex flex-col min-h-0 z-10 overflow-hidden">
        <div className="menu-content-wrap flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>

      <GameMenuBottomNav active={activeNav} />
    </div>
  );
}

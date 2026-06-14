import type { ReactNode } from "react";
import DaxBrand from "./DaxBrand";

interface AppShellProps {
  children: ReactNode;
  showHeader?: boolean;
}

export default function AppShell({ children, showHeader = true }: AppShellProps) {
  return (
    <div className="dax-surface relative w-full h-screen flex flex-col overflow-hidden">
      {showHeader && (
        <header className="relative z-20 shrink-0">
          <div className="flex items-center justify-between px-5 py-3 bg-forest/80 backdrop-blur-sm">
            <DaxBrand variant="header" />
            <span className="text-gold-pale/40 text-[10px] tracking-[0.3em] uppercase hidden md:block">
              Multiplayer
            </span>
          </div>
          <div className="dax-gold-line" />
        </header>
      )}
      <main className="relative flex-1 min-h-0 dax-vignette">{children}</main>
    </div>
  );
}

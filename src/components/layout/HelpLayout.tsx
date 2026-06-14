import DaxBrand from "../UI/DaxBrand";
import { getMainAppUrl } from "../../utils/urls";

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  const mainUrl = getMainAppUrl();

  return (
    <div className="min-h-screen bg-emerald flex flex-col">
      <header className="sticky top-0 z-40 bg-emerald/95 backdrop-blur-md border-b border-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href={mainUrl} className="shrink-0">
            <DaxBrand size="sm" />
          </a>
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold hidden sm:block">
            Help Center
          </span>
          <a
            href={mainUrl}
            className="text-sm text-ivory-muted hover:text-gold transition-colors"
          >
            ← Back to DAX
          </a>
        </div>
        <div className="dax-gold-line" />
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex gap-10">
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-24 space-y-1 text-sm">
            <p className="text-gold text-xs uppercase tracking-widest mb-3 px-3">On this page</p>
            {HELP_NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block px-3 py-1.5 rounded-md text-ivory-muted hover:text-ivory hover:bg-gold/5 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <footer className="border-t border-gold/15 bg-emerald-dark py-6 text-center text-xs text-ivory-dim">
        <p>
          Need more help?{" "}
          <a href="#report" className="text-gold hover:underline">
            Contact support
          </a>
          {" · "}
          <a href={mainUrl} className="text-gold hover:underline">
            Play DAX
          </a>
        </p>
      </footer>
    </div>
  );
}

export const HELP_NAV = [
  { id: "objective", label: "Objective" },
  { id: "turns", label: "Turns" },
  { id: "playing", label: "Playing cards" },
  { id: "draw", label: "Drawing" },
  { id: "uno", label: "UNO call" },
  { id: "wild", label: "Wild cards" },
  { id: "timer", label: "Turn timer" },
  { id: "disconnect", label: "Disconnects" },
  { id: "winning", label: "Win conditions" },
  { id: "scoring", label: "Scoring" },
  { id: "custom", label: "Custom modes" },
  { id: "faq", label: "FAQ" },
  { id: "report", label: "Report & support" },
  { id: "privacy", label: "Privacy" },
  { id: "terms", label: "Terms" },
];

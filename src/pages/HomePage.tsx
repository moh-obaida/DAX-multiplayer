import { Link } from "react-router-dom";
import LobbyTablePreview from "../components/home/LobbyTablePreview";
import LobbyActionPanel from "../components/home/LobbyActionPanel";
import CardPanel from "../components/UI/CardPanel";
import Button from "../components/UI/Button";
import { getHelpUrl } from "../utils/urls";

const LOWER_SECTIONS = [
  {
    title: "How to Play",
    id: "how",
    items: [
      "Match color, number, or action — or play a Wild.",
      "Call DAX! with one card left.",
      "Win tier depends on table size (1st / 2nd / 3rd finisher).",
    ],
  },
  {
    title: "Friends & Rooms",
    id: "friends",
    items: [
      "Add friends by username · see online status.",
      "Host private rooms with custom hand sizes.",
      "Invite directly from your friends list.",
    ],
  },
  {
    title: "Achievements",
    id: "stats",
    items: [
      "Track wins, streaks, and finish-order stats.",
      "Unlock badges on your profile.",
      "Recent match history — last 10 games.",
    ],
  },
  {
    title: "Accessibility",
    id: "a11y",
    items: [
      "Colorblind mode — patterns on every card.",
      "Adjustable font size and sound volume.",
      "Halal · ad-free · no gambling — ever.",
    ],
  },
];

export default function HomePage() {
  return (
    <div className="bg-emerald-dark">
      {/* ── Full-screen game lobby hero ── */}
      <section className="relative min-h-[calc(100vh-4.25rem)] flex flex-col overflow-hidden">
        {/* Ambient depth — not a grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_40%,rgba(22,80,56,0.35)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

        {/* Game HUD: online count */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-dark/80 border border-gold/25 backdrop-blur-sm">
          <span className="dax-status-online" />
          <span className="font-mono text-xs text-ivory">
            <span className="text-gold font-semibold">1,284</span>
            <span className="text-ivory-dim ml-1">online</span>
          </span>
        </div>

        <div className="relative flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 px-4 sm:px-6 py-6 lg:py-8 max-w-7xl mx-auto w-full">
          {/* Action panel — left on desktop, bottom on mobile */}
          <div className="order-2 lg:order-1 lg:w-[280px] shrink-0 w-full flex justify-center lg:justify-start">
            <LobbyActionPanel />
          </div>

          {/* Table preview — hero focal point */}
          <div className="order-1 lg:order-2 flex-1 w-full max-w-3xl lobby-scene-perspective">
            <LobbyTablePreview />
          </div>

          {/* Quick links — right rail */}
          <div className="order-3 hidden xl:flex flex-col gap-3 w-44 shrink-0">
            {[
              { label: "Quick Match", to: "/play" },
              { label: "Friends", to: "/friends" },
              { label: "Rules", href: getHelpUrl() },
              { label: "Profile", to: "/profile" },
            ].map((item) =>
              "href" in item ? (
                <a key={item.label} href={item.href} className="dax-panel px-4 py-3 text-sm text-ivory-muted hover:text-gold hover:border-gold/40 transition-all text-center">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.to!} className="dax-panel px-4 py-3 text-sm text-ivory-muted hover:text-gold hover:border-gold/40 transition-all text-center">
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Subtle scroll hint */}
        <div className="pb-4 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-ivory-dim/60">Scroll for more</span>
        </div>
      </section>

      {/* ── Below the fold — compact game info ── */}
      <section className="border-t border-gold/10 bg-board/20 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LOWER_SECTIONS.map((sec) => (
            <CardPanel key={sec.id} title={sec.title} className="!p-4">
              <ul className="space-y-2">
                {sec.items.map((line) => (
                  <li key={line} className="text-xs text-ivory-muted leading-relaxed flex gap-2">
                    <span className="text-gold shrink-0">▸</span>
                    {line}
                  </li>
                ))}
              </ul>
            </CardPanel>
          ))}
        </div>
        <div className="max-w-6xl mx-auto mt-10 flex flex-wrap justify-center gap-4">
          <Button variant="primary" to="/play">Enter Lobby</Button>
          <Button variant="secondary" to="/register">Create Account</Button>
        </div>
      </section>
    </div>
  );
}

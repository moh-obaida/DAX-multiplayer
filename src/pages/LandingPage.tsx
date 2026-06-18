import { Link } from "react-router-dom";
import Button from "../components/UI/Button";
import Footer from "../components/layout/Footer";
import { copy } from "../lib/copy";

const FEATURES = [
  { title: "2–8 players", desc: "Private rooms with a 6-digit code. Play with friends in real time." },
  { title: "30-second turns", desc: "Fast-paced matches with a visible timer and AFK handling." },
  { title: "UNO-style rules", desc: "Match color or number, wild cards, +2, +4, and manual UNO calls." },
  { title: "Emotes only", desc: "Preset emotes and phrases — no open chat, safe for everyone." },
];

const STEPS = [
  { step: "1", title: "Create or join", desc: "Host a room and share your code, or enter a friend's 6-digit code." },
  { step: "2", title: "Play your cards", desc: "Match the discard pile by color, number, or action. Draw if you can't play." },
  { step: "3", title: "Call UNO!", desc: "Tap UNO when one card remains — or opponents can call you out." },
];

export default function LandingPage() {
  const appUrl = import.meta.env.VITE_APP_URL || "";

  return (
    <div className="min-h-screen flex flex-col bg-emerald">
      <header className="border-b border-gold/10 bg-emerald-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logos/dax-icon.png" alt="" className="h-9 w-auto" width={36} height={36} />
            <img src="/logos/dax-wordmark.png" alt="DAX" className="h-5 w-auto hidden sm:block" />
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/help" className="text-sm text-ivory-muted hover:text-gold transition-colors hidden sm:inline">How to play</Link>
            <Button variant="primary" size="sm" to="/">{copy.cta.playNow}</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24 px-4">
          <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative">
            <img
              src="/logos/dax-full.png"
              alt="DAX"
              className="mx-auto w-full max-w-md mb-8"
              width={480}
              height={120}
            />
            <p className="text-gold text-xs uppercase tracking-[0.4em] mb-4">Multiplayer card game</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-ivory mb-4 leading-tight">
              {copy.app.tagline}
            </h1>
            <p className="text-ivory-muted text-lg max-w-xl mx-auto mb-8">
              {copy.app.description} Halal, ad-free, no gambling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" to="/">{copy.cta.playNow}</Button>
              <Button variant="secondary" size="lg" to="/help">How to play</Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 border-t border-gold/10 bg-board/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-ivory text-center mb-10">Why DAX</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="dax-panel p-5">
                  <h3 className="font-display text-gold font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-ivory-muted">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-ivory text-center mb-10">How to play</h2>
            <div className="space-y-6">
              {STEPS.map((s) => (
                <div key={s.step} className="flex gap-4 items-start">
                  <span className="font-display text-2xl font-bold text-gold tabular-nums w-10 shrink-0">{s.step}</span>
                  <div>
                    <h3 className="font-display text-ivory font-semibold mb-1">{s.title}</h3>
                    <p className="text-sm text-ivory-muted">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button variant="neon" to="/help#playing">Full rules</Button>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 border-t border-gold/10 text-center">
          <p className="text-ivory-dim text-sm mb-4">Ready to play?</p>
          <Button variant="primary" to="/">{copy.cta.playNow}</Button>
        </section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoGame",
            name: "DAX",
            description: copy.app.description,
            url: appUrl || undefined,
            genre: "Card Game",
            gamePlatform: "Web browser",
            numberOfPlayers: { "@type": "QuantitativeValue", minValue: 2, maxValue: 8 },
          }),
        }}
      />
    </div>
  );
}

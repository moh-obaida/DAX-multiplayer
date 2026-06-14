import Button from "../components/UI/Button";
import CardPanel from "../components/UI/CardPanel";
import { DAX_RULES } from "../config/daxRules";

const FEATURES = [
  { icon: "⚡", title: "Real-time Multiplayer", desc: "Low-latency sync across 2–8 players. Quick Match or private rooms with 6-digit codes." },
  { icon: "🔒", title: "Private Rooms", desc: "Host-controlled lobbies with custom hand sizes, DAX! call rules, and house rule toggles." },
  { icon: "👥", title: "Friends System", desc: "Add by username, see online status, send invites, and block users you don't want at your table." },
  { icon: "🏆", title: "Achievements & Stats", desc: "Win rate, streaks, finish-order tiers, and unlockable badges tracked on your profile." },
  { icon: "👁", title: "Colorblind Support", desc: "Patterns and labels on every card so color never blocks competitive play." },
  { icon: "☪", title: "Halal · Ad-free · No Gambling", desc: "Built for clean fun — no ads, no wagering, no loot boxes. Stats and bragging rights only." },
];

const HOW_TO_PLAY = [
  { step: "01", title: "Match or Wild", text: "Play a card matching color, number, or action — or drop a Wild to change color." },
  { step: "02", title: "Call DAX!", text: "One card left? Hit DAX! before your turn ends or draw penalty cards." },
  { step: "03", title: "Win by tier", text: "In big games the 2nd or 3rd finisher wins. Empty your hand and climb the finish order." },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center game-grid-bg">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-pulse-gold" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-light/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="dax-badge mb-6">{DAX_RULES.tagline}</div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              <span className="dax-text-gradient">DAX</span>
              <br />
              <span className="text-ivory">Multiplayer Card Game</span>
            </h1>
            <p className="text-lg text-ivory-muted max-w-lg mb-8 leading-relaxed">
              The premium online table for UNO-inspired action with DAX house rules — tiered wins, turn timers, private lobbies, and a full social layer.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" to="/play">Play Now</Button>
              <Button variant="secondary" size="lg" to="/play">Create Private Room</Button>
            </div>
            <div className="flex gap-8 mt-10 pt-8 border-t border-gold/10">
              {[["12K+", "Players Online"], ["4.8", "Rating"], ["2–8", "Per Table"]].map(([v, l]) => (
                <div key={l}>
                  <div className="dax-stat-value">{v}</div>
                  <div className="text-xs text-ivory-dim uppercase tracking-wider mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center animate-float">
            <div className="relative">
              <div className="absolute -inset-4 bg-gold/10 rounded-3xl blur-2xl" />
              <img src="/brand/dax-banner.png" alt="DAX" className="relative w-full max-w-md rounded-2xl shadow-panel border border-gold/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-ivory mb-3">Built for Serious Play</h2>
            <p className="text-ivory-muted max-w-xl mx-auto">Every system you expect from a modern multiplayer card platform — not a weekend prototype.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <CardPanel key={f.title} glow className="group hover:shadow-panel-hover transition-shadow duration-300">
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-display font-semibold text-ivory mb-2 group-hover:text-gold transition-colors">{f.title}</h3>
                <p className="text-sm text-ivory-muted leading-relaxed">{f.desc}</p>
              </CardPanel>
            ))}
          </div>
        </div>
      </section>

      {/* How to play */}
      <section className="py-24 bg-board/30 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-center mb-12">How to Play</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_TO_PLAY.map((h) => (
              <div key={h.step} className="relative dax-panel p-8 text-center">
                <span className="font-display text-5xl font-black text-gold/20 absolute top-4 right-4">{h.step}</span>
                <h3 className="font-display text-xl text-gold mb-3">{h.title}</h3>
                <p className="text-sm text-ivory-muted">{h.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="neon" to="/play">Enter the Lobby</Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold dax-text-gradient mb-4">Your Table Awaits</h2>
          <p className="text-ivory-muted mb-8">Join thousands playing DAX right now. Free forever — no pay-to-win, no ads.</p>
          <Button variant="primary" size="lg" to="/register">Create Account</Button>
        </div>
      </section>
    </div>
  );
}

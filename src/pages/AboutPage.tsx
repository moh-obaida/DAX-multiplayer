import PageShell from "../components/layout/PageShell";
import CardPanel from "../components/UI/CardPanel";
import Button from "../components/UI/Button";
import { copy } from "../lib/copy";

export default function AboutPage() {
  return (
    <PageShell title="About DAX" subtitle="A premium, halal-friendly multiplayer card game.">
      <div className="max-w-2xl space-y-6 text-ivory-muted leading-relaxed">
        <CardPanel>
          <p className="mb-4">
            <strong className="text-ivory">DAX</strong> is a fast-paced multiplayer card game inspired by UNO.
            Play with 2–4 friends in real time — match colors and numbers, call UNO at the right moment,
            and empty your hand first to win.
          </p>
          <p className="mb-4">
            We built DAX to be halal, ad-free, and free of gambling. No real-money wagering, no loot boxes —
            just fun, stats, and friendly competition.
          </p>
          <p>{copy.app.description}</p>
        </CardPanel>
        <div className="flex gap-3">
          <Button variant="primary" to="/play">{copy.cta.playNow}</Button>
          <Button variant="secondary" to="/help">Rules &amp; FAQ</Button>
        </div>
      </div>
    </PageShell>
  );
}

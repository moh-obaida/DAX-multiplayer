import CardPanel from "../components/UI/CardPanel";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-10">
      <h2 className="text-xl font-bold text-ivory mb-4 pb-2 border-b border-gold/20">{title}</h2>
      <div className="space-y-4 text-ivory-muted leading-relaxed">{children}</div>
    </section>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-ivory">
      {children}
    </div>
  );
}

function ScoringRow({ card, points }: { card: string; points: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gold/10 last:border-0">
      <span>{card}</span>
      <span className="text-gold font-semibold tabular-nums">{points}</span>
    </div>
  );
}

export default function HelpPage() {
  return (
    <article>
      <header className="mb-10">
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-2">DAX Help Center</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-ivory mb-3">Rules &amp; Support</h1>
        <p className="text-ivory-muted text-lg max-w-2xl">
          Everything you need to play DAX — from your first match to custom house rules, scoring, and what happens when someone disconnects.
        </p>
      </header>

      <Section id="objective" title="Basic objective">
        <p>
          DAX is a fast-paced multiplayer card game. Be the first player to play all the cards in your hand.
          Match the top card on the discard pile by <strong className="text-ivory">color</strong>,{" "}
          <strong className="text-ivory">number</strong>, or <strong className="text-ivory">action symbol</strong>,
          or play a Wild card to change the active color.
        </p>
        <Tip>
          DAX is halal, ad-free, and has no gambling. You play for fun, stats, and achievements — never real money.
        </Tip>
      </Section>

      <Section id="turns" title="How turns work">
        <p>Play moves around the table in order. Direction starts clockwise and can reverse mid-game.</p>
        <ol className="list-decimal list-inside space-y-2 pl-1">
          <li>On your turn, play one valid card from your hand <em>or</em> draw one card from the deck.</li>
          <li>If you draw, your turn ends and play passes to the next player.</li>
          <li>Action cards (Skip, Reverse, Draw +2, Wild) apply their effect immediately.</li>
          <li>A gold highlight shows whose turn it is. Watch the turn timer in the game bar.</li>
        </ol>
      </Section>

      <Section id="playing" title="Playing cards — same color or number">
        <p>A card is valid when it matches the top discard card by any of these rules:</p>
        <CardPanel className="mt-2">
          <ul className="space-y-3 text-sm">
            <li><span className="text-gold font-medium">Same color</span> — any card sharing the active color (red, yellow, green, blue).</li>
            <li><span className="text-gold font-medium">Same number</span> — number cards with the same value, even if the color differs.</li>
            <li><span className="text-gold font-medium">Same action</span> — Skip on Skip, Reverse on Reverse, +2 on +2.</li>
            <li><span className="text-gold font-medium">Wild / Wild +4</span> — playable on any turn; you choose the new color.</li>
          </ul>
        </CardPanel>
        <p className="text-sm">If you have no valid play, you must draw. You cannot pass without drawing unless house rules say otherwise.</p>
      </Section>

      <Section id="draw" title="Draw rules">
        <ul className="list-disc list-inside space-y-2">
          <li>Tap the draw pile to take one card when you cannot (or choose not to) play.</li>
          <li>Drawing ends your turn — you do not get a second chance to play that card in the same turn.</li>
          <li>If the draw pile is empty, the discard pile (except the top card) is shuffled to form a new deck.</li>
          <li><strong className="text-ivory">Draw +2</strong> — the next player draws two cards and loses their turn.</li>
          <li><strong className="text-ivory">Wild +4</strong> — the next player draws four cards and loses their turn; you pick the new color.</li>
        </ul>
      </Section>

      <Section id="uno" title="UNO call">
        <p>
          When you have exactly <strong className="text-ivory">one card left</strong>, you must tap the{" "}
          <strong className="text-gold">UNO</strong> button before the next player takes their turn.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Rooms can enable or disable UNO call enforcement in room settings.</li>
          <li>If you forget to call UNO and another player notices before your next turn, you may draw a penalty card (when enabled).</li>
          <li>Calling UNO early (with more than one card) has no effect — wait until you truly have one card left.</li>
        </ul>
      </Section>

      <Section id="wild" title="Wild cards">
        <p>There are two wild card types, each playable on any color:</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-2">
          <CardPanel title="Wild">
            <p className="text-sm">Change the active color to any of the four colors. No extra draw.</p>
          </CardPanel>
          <CardPanel title="Wild +4">
            <p className="text-sm">Change color and force the next player to draw four cards and skip their turn.</p>
          </CardPanel>
        </div>
        <Tip>After playing a Wild, a color picker appears. Choose carefully — it affects every player until the color changes again.</Tip>
      </Section>

      <Section id="timer" title="Turn timer">
        <p>
          Each turn has a <strong className="text-ivory">30-second timer</strong> shown in the game navbar.
          The bar turns yellow below 20 seconds and red below 10.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>If time runs out, you automatically draw one card and your turn ends.</li>
          <li>The timer resets when the next player&apos;s turn begins.</li>
          <li>Stay attentive in larger games — timeouts keep matches moving for everyone.</li>
        </ul>
      </Section>

      <Section id="disconnect" title="Disconnect rules">
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-ivory">Brief disconnect</strong> — you have a short grace period to reconnect to the same game.</li>
          <li><strong className="text-ivory">Away status</strong> — if you miss several turns, you are marked Away. Other players can continue.</li>
          <li><strong className="text-ivory">Long disconnect</strong> — after the grace window, you are removed and your remaining cards are handled per room rules.</li>
          <li>Private rooms: the host can pause or vote to continue without a disconnected player.</li>
        </ul>
        <Tip>Enable &ldquo;Remember me&rdquo; in Settings so reconnecting after a drop is faster.</Tip>
      </Section>

      <Section id="winning" title="Win condition tiers">
        <p>In standard DAX, the winner depends on how many players are in the match:</p>
        <CardPanel highlight>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span><strong className="text-ivory">2–4 players</strong></span>
              <span className="text-gold">First to empty their hand wins</span>
            </div>
            <div className="flex justify-between gap-4">
              <span><strong className="text-ivory">5 players</strong></span>
              <span className="text-gold">2nd player to finish wins</span>
            </div>
            <div className="flex justify-between gap-4">
              <span><strong className="text-ivory">6–8 players</strong></span>
              <span className="text-gold">3rd player to finish wins</span>
            </div>
          </div>
        </CardPanel>
        <p className="text-sm">Finish order is tracked automatically. Stats and achievements update when the match ends.</p>
      </Section>

      <Section id="scoring" title="Scoring">
        <p>When a round ends, remaining cards in each player&apos;s hand count against them:</p>
        <CardPanel title="Point values">
          <ScoringRow card="Number cards (0–9)" points="Face value" />
          <ScoringRow card="Skip, Reverse, Draw +2" points="20 each" />
          <ScoringRow card="Wild, Wild +4" points="50 each" />
        </CardPanel>
        <p className="text-sm">Lower total penalty points across a session means stronger overall performance in ranked-style stats.</p>
      </Section>

      <Section id="custom" title="Custom modes & house rules">
        <p>Private rooms let the host customize the experience before starting:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-ivory">Players</strong> — 2 to 8</li>
          <li><strong className="text-ivory">Starting hand</strong> — 7, 10, 14, or 21 cards</li>
          <li><strong className="text-ivory">UNO call</strong> — optional enforcement</li>
          <li><strong className="text-ivory">Custom rules toggle</strong> — stacking, forced play, Wild +4 challenges (host-defined)</li>
        </ul>
        <p className="text-sm">Quick Match uses default rules: 7-card hands, UNO enabled, standard timer, no stacking.</p>
      </Section>

      <Section id="faq" title="FAQ">
        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <div key={item.q}>
              <h3 className="text-ivory font-semibold mb-1">{item.q}</h3>
              <p className="text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="report" title="Report & support">
        <p>
          Found a bug, abusive behavior, or a player breaking room rules? Report it so we can review quickly.
        </p>
        <CardPanel>
          <p className="text-sm mb-3">Email support with your username, game or room ID, and a short description:</p>
          <a href="mailto:support@exampleurl.com" className="text-gold font-medium hover:underline">
            support@exampleurl.com
          </a>
          <p className="text-xs text-ivory-dim mt-4">
            Replace with your live support address before launch. Include screenshots when possible.
          </p>
        </CardPanel>
      </Section>

      <Section id="privacy" title="Privacy">
        <p>DAX collects only what is needed to run multiplayer games and your profile:</p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Account email and username for login and friend search</li>
          <li>Game stats, match history, and achievement progress</li>
          <li>Room and session data during active play (not sold to third parties)</li>
        </ul>
        <p className="text-sm">We do not run ads or gambling systems. Full privacy policy will be published before public launch.</p>
      </Section>

      <Section id="terms" title="Terms of use">
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>DAX is free to play for entertainment. No real-money wagering.</li>
          <li>Be respectful in chat and emotes. Harassment can lead to account restrictions.</li>
          <li>One account per person. Username impersonation is not allowed.</li>
          <li>We may update rules or features; continued play means acceptance of reasonable changes.</li>
        </ul>
      </Section>
    </article>
  );
}

const FAQ_ITEMS = [
  {
    q: "Can I play with friends only?",
    a: "Yes. Create a Private Room from the Play page, share the 6-digit code, or invite friends directly from your Friends list.",
  },
  {
    q: "Does DAX support colorblind players?",
    a: "Yes. Enable Colorblind Mode in Settings — cards gain patterns and labels so colors are easier to distinguish.",
  },
  {
    q: "What happens if I join mid-game?",
    a: "You cannot join an in-progress public match. Private rooms only allow joining while status is Waiting, before the host starts.",
  },
  {
    q: "Can I play on mobile?",
    a: "The web app is responsive. A dedicated mobile app may come later; for now use a modern mobile browser.",
  },
  {
    q: "Is chat moderated?",
    a: "Emotes are preset and safe. Text chat reports are reviewed. Use Report & Support for serious issues.",
  },
];

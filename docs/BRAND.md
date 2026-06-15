# DAX Design System

Premium emerald-and-gold design system for **DAX** — a fast-paced, modern multiplayer
card game inspired by UNO. Web-first React game, dark mode by default, with a circular
board, fan-style hand dock, and full colorblind support.

> **Tone:** modern, premium, playful but professional.

---

## Sources

- **Brand assets** (3 logos): logomark, wordmark, full lockup — supplied as PNGs, copied
  into `assets/`.
- **Brand guidelines** (colors, type, components, tone) provided inline by the user.
- **Card palette** locked and confirmed June 15 2026: red `#f44336`, blue `#2196f3`,
  green `#4caf50`, yellow `#ffd54f` — bright spec palette for multiplayer visibility.

No codebase or Figma file was attached; the system is built from the brand assets +
written guidelines.

---

## CONTENT FUNDAMENTALS

How DAX speaks — terse, warm, in-the-moment.

- **Voice:** second person, present tense, action-first. "Play your DAX." "It's your
  turn." "Choose a color." The game talks *to* the player about *now*.
- **Casing:** Sentence case for UI copy and buttons (`Play card`, `Leave table`).
  ALL-CAPS reserved for the wordmark **DAX**, the **UNO!** call, and micro-labels /
  eyebrows (`ROUND OVER`, `WILD CARD`).
- **Length:** ultra-short. Buttons 1–2 words; toasts one clause ("+2 to the next
  player", "Can't play that — match color or number"). Never a paragraph mid-game.
- **Numbers:** always tabular figures for scores, counts, timers (`0:03`, `×3`,
  `1,240`). Use `.dax-tnum` or `--font-num`.
- **Emoji:** sparingly, only as functional glyphs in chrome — 👁 spectators, 💬 emotes,
  ⋯ menu. Never decorative emoji in body copy or on cards.
- **Vibe:** confident croupier energy — premium table, quick banter, never fussy.
  Encouraging on wins, neutral on mistakes (no scolding).

Examples: `Start game` · `Finding players…` · `Reconnecting…` · `UNO! called` ·
`Emptied their hand first` · `Drew a card`.

---

## VISUAL FOUNDATIONS

- **Color & vibe.** Dark, premium casino-lounge. Backgrounds are deep emerald
  (`--dax-emerald-800` app, `--dax-emerald-600` board felt) under a soft radial vignette
  (`--grad-app`, `--grad-felt`). Gold (`--dax-gold-500` / `--grad-gold`) is the single
  hero accent — selection, primary CTAs, the active-turn ring, win moments. Card suits use
  the locked spec palette. Imagery vibe: warm cream + jewel tones on near-black green; no
  photography, no decorative gradients beyond felt and gold.
- **Type.** Display & numerals in **Space Grotesk** (geometric, angular — echoes the DAX
  wordmark); body & UI in **Hanken Grotesk** (warm humanist grotesque, clean at 14–16px).
  Headings 600–700, body 400–500. Tabular numerals everywhere a number can change.
  *(Confirmed June 15 2026: Space Grotesk + Hanken Grotesk over the original Inter placeholder — see Fonts.)*
- **Spacing.** 8px grid (`--space-*`) with 4px half-steps. Generous around the felt,
  tight inside chips and seats.
- **Backgrounds.** Full-bleed radial emerald vignettes; the board is a single elliptical
  felt with a dark ring border and inset shadow. No repeating patterns or textures.
- **Corner radii.** 12px is the system default (`--radius-md`) and the playing-card corner
  (`--radius-card`). Pills (`--radius-pill`) for badges, timer track, toasts. Circles for
  avatars.
- **Cards.** 96×144 (`--card-w/h`). Suit-colored gradient face (155° light→deep), a tilted
  cream oval behind a large central value, mini value+symbol in two opposite corners.
  Hairline dark edge; **selected** swaps to a 2px gold border + `--glow-gold` and lifts
  `translateY(-10px) scale(1.10)`. Card backs are emerald with a gold inner frame reading
  **DAX**.
- **Shadows.** Deep, soft, dark-UI shadows (`--shadow-sm…xl`). Cards use `--shadow-card`
  to lift off the felt; raised/selected cards use `--shadow-card-raised`. Inner sheen
  (`--inset-sheen`) on gold surfaces; inset edge (`--inset-edge`) on sunken fields.
- **Glow.** Gold glow is the premium signal: `--glow-gold` (selected card), `--glow-turn`
  (active player ring), `--glow-gold-soft` (ambient, win card).
- **Motion.** `--ease-out` for most transitions; `--ease-snap` (slight overshoot) for card
  selection and toggle knobs; `--ease-in-out` for direction/flow. Durations `--dur-fast`
  120ms (press), `--dur-base` 200ms (card play), `--dur-slow` 360ms, `--dur-deal` 500ms.
  Reduced-motion safe: end-states are the base styles.
- **Hover / press.** Buttons lift-press (`translateY(1px) scale(.985)`); icon buttons
  scale to .92. Cards rise on hover via the dock fan; gold elements brighten to
  `--accent-hover`. No color inversions.
- **Transparency & blur.** Overlays (color picker, win) use `--surface-overlay`
  (translucent deep emerald) + `--blur-overlay` (10px). Badge tints sit at 8–16% alpha.
- **Layout rules.** Turn timer pinned top; hand dock pinned bottom; players ringed around
  a centered felt; draw deck + discard pile dead-center. All cards stay visible on
  desktop/tablet; min card width 40px; 16px names desktop / 14px tablet.
- **Accessibility.** Colorblind mode adds suit symbols (✚ ● ▲ ◆ ★) on every card; never
  color-only. Targets ≥44px (`--hit-min`); 4.5:1+ contrast.

---

## ICONOGRAPHY

DAX has **no custom icon set** — a deliberate, minimal approach.

- **Suit symbols** are the only first-class iconography: ✚ red, ● blue, ▲ green, ◆ yellow,
  ★ wild — Unicode glyphs in card faces/corners, surfaced in colorblind mode. Intrinsic to
  gameplay, not decoration.
- **Action glyphs** on cards use Unicode / text: `⦸` skip, `⮃` reverse, `+2` / `+4`.
- **UI chrome** uses a tiny functional set of emoji glyphs: 👁 spectators, 💬 emotes,
  ⋯ menu. Small, monochrome-ish.
- **No SVG icon font or PNG sprite ships.** If a richer toolbar is needed later,
  substitute **Lucide** (CDN, 1.5px stroke) to match the clean geometric tone — flag the
  addition. Do **not** hand-roll decorative SVG icons.

---

## Fonts — substitution note

No font binaries were supplied. The brand sheet named **Inter** as a placeholder; this
system upgrades to **Space Grotesk** (display/numerals) + **Hanken Grotesk** (body/UI) to
better match the angular DAX wordmark, both loaded from Google Fonts in `tokens/fonts.css`.
**Confirmed June 15 2026.** To self-host, drop `.woff2` files in `tokens/` and swap the `@import` for `@font-face` rules.

---

## INDEX / Manifest

**Root**
- `styles.css` — global entry point (`@import` manifest only; consumers link this one file)
- `readme.md` — this file
- `SKILL.md` — Agent-Skills wrapper

**Tokens** (`tokens/`)
- `colors.css` — emerald scale, gold scale, neutrals, suit colors, semantic, timer stops
- `typography.css` — families, weights, scale, leading, tracking
- `spacing.css` — 8px spacing, radii, card geometry, hit targets, layout
- `effects.css` — shadows, gold glows, gradients, motion, blur
- `fonts.css` — Space Grotesk + Hanken Grotesk (Google Fonts)
- `base.css` — element defaults + helpers (`.dax-tnum`, `.dax-eyebrow`)

**Foundation cards** (`guidelines/*.card.html`) — Colors (surfaces, gold, neutrals, suits,
semantic), Type (display, body, scale, numerals), Spacing (scale, radius, shadows, glow),
Brand (gradients, logos).

**Components**
- `components/core/` — `Button`, `IconButton`, `Badge`, `Avatar`
- `components/forms/` — `Input`, `Switch`
- `components/game/` — `PlayingCard`, `TurnTimer`, `PlayerSeat`

**UI kit**
- `ui_kits/dax-table/` — full interactive game-table prototype (lobby → table → wild
  picker → win). See its `README.md`.

**Assets** (`assets/`) — `dax-logo-full.png`, `dax-logomark.png`, `dax-wordmark.png`

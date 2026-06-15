import type { Card, CardColor } from "../../types/game";
import { COLOR_LABELS } from "../../types/ui";
import { SUIT_COLORS } from "../../lib/constants";
import PlayingCard from "../Common/PlayingCard";

interface DiscardPileProps {
  topCard: Card | undefined;
  activeColor: CardColor | null;
}

export default function DiscardPile({ topCard, activeColor }: DiscardPileProps) {
  const displayColor = activeColor ?? topCard?.color;

  return (
    <div className="flex flex-col items-center gap-2" aria-label="Discard pile">
      {topCard ? <PlayingCard card={topCard} size="lg" /> : null}
      {displayColor && (
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full border border-black"
            style={{ backgroundColor: SUIT_COLORS[displayColor] }}
            aria-hidden
          />
          <span className="text-[10px] uppercase tracking-widest text-ivory">
            {COLOR_LABELS[displayColor]}
          </span>
        </div>
      )}
      <span className="text-[10px] uppercase tracking-widest text-ivory-dim">Discard</span>
    </div>
  );
}

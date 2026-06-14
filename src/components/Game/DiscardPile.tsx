import type { Card as CardType } from "../../types/game";
import Card from "./Card";

interface DiscardPileProps {
  discardPile: CardType[];
}

export default function DiscardPile({ discardPile }: DiscardPileProps) {
  const topCard = discardPile[discardPile.length - 1];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-gold-pale/50 text-[10px] uppercase tracking-[0.2em]">Discard</div>
      {topCard && <Card card={topCard} size="large" />}
      <div className="text-gold-pale/30 text-xs">({discardPile.length} cards)</div>
    </div>
  );
}

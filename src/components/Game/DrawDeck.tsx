import type { Card } from "../../types/game";
import PlayingCard from "../Common/PlayingCard";

interface DrawDeckProps {
  count: number;
  onDraw: () => void;
  disabled?: boolean;
}

export default function DrawDeck({ count, onDraw, disabled }: DrawDeckProps) {
  const dummy: Card = { id: "deck", color: "blue", type: "number", value: 0 };

  return (
    <button
      type="button"
      onClick={onDraw}
      disabled={disabled}
      className="flex flex-col items-center gap-2 group disabled:opacity-50 transition-opacity"
      aria-label={`Draw pile, ${count} cards remaining`}
    >
      <div className="relative">
        <PlayingCard card={dummy} faceDown size="lg" />
        <span className="absolute -bottom-2 -right-2 bg-gold text-emerald-dark text-xs font-bold px-2 py-0.5 rounded-full font-display">
          {count}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-ivory-dim group-hover:text-gold transition-colors">
        Draw
      </span>
    </button>
  );
}

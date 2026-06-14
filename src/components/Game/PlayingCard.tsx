import type { Card as CardType } from "../../types/game";
import { getCardDisplayText } from "../../utils/cardUtils";

interface PlayingCardProps {
  card: CardType;
  onClick?: () => void;
  selected?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  faceDown?: boolean;
}

const sizes = {
  xs: "w-10 h-14 text-[10px]",
  sm: "w-14 h-20 text-xs",
  md: "w-[4.5rem] h-[6.5rem] text-base",
  lg: "w-24 h-36 text-2xl",
};

export default function PlayingCard({ card, onClick, selected, size = "md", faceDown }: PlayingCardProps) {
  if (faceDown) {
    return (
      <div className={`${sizes[size]} rounded-lg border-2 border-gold/30 bg-gradient-to-br from-emerald-light to-emerald-dark shadow-panel flex items-center justify-center shrink-0`}>
        <img src="/brand/dax-icon.png" alt="" className="w-1/2 opacity-40" />
      </div>
    );
  }

  const isWild = card.type === "wild" || card.type === "wild_draw4";
  const colorClass = isWild ? "bg-gradient-to-br from-purple-700 via-pink-600 to-purple-800" : `bg-card-${card.color}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${sizes[size]} ${colorClass} rounded-lg border-2 font-display font-bold text-white shrink-0
        flex flex-col items-center justify-center transition-all duration-200
        ${selected ? "border-gold scale-110 -translate-y-3 shadow-gold z-20" : "border-white/20 hover:-translate-y-2 hover:shadow-gold-sm"}
        ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <span>{getCardDisplayText(card)}</span>
      {card.type === "number" && <span className="text-[0.6em] opacity-70 mt-0.5 uppercase">{card.color[0]}</span>}
    </button>
  );
}

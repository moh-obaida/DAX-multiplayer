import type { Card as CardType } from "../../types/game";
import { getCardDisplayText } from "../../utils/cardUtils";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  selected?: boolean;
  size?: "small" | "medium" | "large";
}

export default function Card({ card, onClick, selected, size = "medium" }: CardProps) {
  const colorMap = {
    red: "bg-red",
    yellow: "bg-yellow",
    green: "bg-green",
    blue: "bg-blue",
  };

  const sizeMap = {
    small: "w-16 h-24",
    medium: "w-24 h-36",
    large: "w-32 h-48",
  };

  const isWild = card.type === "wild" || card.type === "wild_draw4";

  return (
    <div
      onClick={onClick}
      className={`${sizeMap[size]} rounded-lg flex items-center justify-center cursor-pointer transition-all font-bold text-white relative
        ${isWild ? "bg-gradient-to-br from-purple-600 to-pink-600" : colorMap[card.color]}
        ${selected
          ? "scale-110 border-2 border-gold shadow-gold-sm"
          : "hover:scale-105 border border-forest-border/80"
        }`}
    >
      <div className="text-center">
        <div className="text-2xl">{getCardDisplayText(card)}</div>
        {card.type === "number" && (
          <div className="text-xs opacity-75">({card.color[0].toUpperCase()})</div>
        )}
      </div>
    </div>
  );
}

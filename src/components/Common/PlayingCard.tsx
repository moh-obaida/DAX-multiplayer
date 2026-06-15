import type { Card as CardType, CardColor } from "../../types/game";
import { COLOR_LABELS } from "../../types/ui";
import { SUIT_COLORS } from "../../lib/constants";

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
  md: "w-24 h-36 text-base",
  lg: "w-[120px] h-[144px] text-2xl",
};

function suitSymbol(color: CardColor): string {
  const map: Record<CardColor, string> = { red: "♦", yellow: "●", green: "♣", blue: "♠" };
  return map[color];
}

function cardLabel(card: CardType): string {
  if (card.type === "number") return String(card.value ?? 0);
  if (card.type === "skip") return "⊘";
  if (card.type === "reverse") return "⇄";
  if (card.type === "draw2") return "+2";
  if (card.type === "wild") return "W";
  if (card.type === "wild_draw4") return "+4";
  return "";
}

export default function PlayingCard({ card, onClick, selected, size = "md", faceDown }: PlayingCardProps) {
  if (faceDown) {
    return (
      <div
        className={`${sizes[size]} rounded-xl border-2 border-gold/40 bg-gradient-to-br from-board to-emerald shadow-panel flex items-center justify-center shrink-0 playing-card-back`}
        aria-label="Face-down card"
      >
        <span className="font-display text-gold/50 text-lg font-bold">DAX</span>
      </div>
    );
  }

  const isWild = card.type === "wild" || card.type === "wild_draw4";
  const bgColor = isWild ? undefined : SUIT_COLORS[card.color];
  const patternClass = isWild ? "" : `playing-card-${card.color}`;

  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={`${COLOR_LABELS[card.color]} ${card.type} ${card.value ?? ""}`}
      className={`${sizes[size]} ${patternClass} rounded-xl border-2 border-black font-display font-bold text-white shrink-0
        flex flex-col items-center justify-center transition-all duration-200 relative overflow-hidden
        ${selected ? "border-gold scale-110 -translate-y-3 shadow-gold z-20" : "hover:-translate-y-1 hover:shadow-gold-sm"}
        ${onClick ? "cursor-pointer" : "cursor-default"}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      {isWild && (
        <div className="absolute inset-0 bg-gradient-to-br from-red via-yellow via-green to-blue opacity-90" />
      )}
      <span className="relative z-10">{cardLabel(card)}</span>
      {!isWild && (
        <span className="relative z-10 text-[0.55em] opacity-80 mt-0.5" aria-hidden>
          {suitSymbol(card.color)}
        </span>
      )}
      <span className="sr-only">{COLOR_LABELS[card.color]}</span>
    </Tag>
  );
}

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

const SUIT_GLYPHS: Record<CardColor, string> = {
  red: "✚",
  blue: "●",
  green: "▲",
  yellow: "◆",
};

const SUIT_DEEP: Record<CardColor, string> = {
  red: "#c5362b",
  blue: "#1976d2",
  green: "#388e3c",
  yellow: "#e0b53d",
};

function cardLabel(card: CardType): string {
  if (card.type === "number") return String(card.value ?? 0);
  if (card.type === "skip") return "⦸";
  if (card.type === "reverse") return "⮃";
  if (card.type === "draw2") return "+2";
  if (card.type === "wild") return "W";
  if (card.type === "wild_draw4") return "+4";
  return "";
}

export default function PlayingCard({ card, onClick, selected, size = "md", faceDown }: PlayingCardProps) {
  if (faceDown) {
    return (
      <div
        className={`${sizes[size]} rounded-[var(--radius-card)] border-2 border-gold/40 flex items-center justify-center shrink-0 playing-card-back`}
        style={{ background: "var(--surface-card-back)", boxShadow: "var(--shadow-card)" }}
        aria-label="Face-down card"
      >
        <span className="font-display text-gold/60 text-sm font-bold tracking-widest">DAX</span>
      </div>
    );
  }

  const isWild = card.type === "wild" || card.type === "wild_draw4";
  const color = card.color;
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={`${COLOR_LABELS[color]} ${card.type} ${card.value ?? ""}`}
      className={`${sizes[size]} playing-card-${color} rounded-[var(--radius-card)] border-2 font-display font-bold shrink-0
        flex flex-col items-center justify-center relative overflow-hidden
        transition-all duration-200
        ${selected ? "border-gold -translate-y-2.5 z-20" : "border-black hover:-translate-y-1"}
        ${onClick ? "cursor-pointer" : "cursor-default"}`}
      style={{
        background: isWild
          ? "linear-gradient(135deg, #f44336, #ffd54f, #4caf50, #2196f3)"
          : `linear-gradient(155deg, ${SUIT_COLORS[color]} 0%, ${SUIT_DEEP[color]} 100%)`,
        boxShadow: selected ? "var(--glow-gold)" : "var(--shadow-card)",
        transform: selected ? "translateY(-10px) scale(1.10)" : undefined,
        color: isWild ? "#fff" : "var(--text-on-card)",
      }}
    >
      <span className="absolute top-1 left-1.5 text-[0.45em] opacity-70 dax-tnum">{cardLabel(card)}</span>
      <span className="absolute bottom-1 right-1.5 text-[0.45em] opacity-70 rotate-180 dax-tnum">{cardLabel(card)}</span>
      <div
        className="absolute w-[55%] h-[38%] rounded-full opacity-25"
        style={{ background: "var(--dax-cream)", transform: "rotate(-12deg)" }}
        aria-hidden
      />
      <span className="relative z-10 text-2xl dax-tnum">{isWild ? "★" : cardLabel(card)}</span>
      {!isWild && (
        <span className="relative z-10 text-lg mt-0.5" aria-hidden>
          {SUIT_GLYPHS[color]}
        </span>
      )}
      <span className="sr-only">{COLOR_LABELS[color]}</span>
    </Tag>
  );
}

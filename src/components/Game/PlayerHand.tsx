import type { Card } from "../../types/game";
import PlayingCard from "./PlayingCard";

interface PlayerHandProps {
  cards: Card[];
  onPlay?: (cardId: string) => void;
  selectedId?: string | null;
  isInteractive?: boolean;
}

export default function PlayerHand({ cards, onPlay, selectedId, isInteractive = true }: PlayerHandProps) {
  const count = cards.length;
  const spread = Math.min(count * 14, 120);
  const startAngle = -spread / 2;

  return (
    <div className="relative w-full flex justify-center items-end h-44 px-4 overflow-visible">
      <div className="relative flex justify-center" style={{ width: `${Math.max(count * 52, 200)}px`, height: "160px" }}>
        {cards.map((card, i) => {
          const angle = count <= 1 ? 0 : startAngle + (spread / (count - 1)) * i;
          const lift = Math.abs(angle) * 0.3;
          return (
            <div
              key={card.id}
              className="absolute bottom-0 origin-bottom transition-transform duration-200"
              style={{
                transform: `rotate(${angle}deg) translateY(-${lift}px)`,
                left: `${50 + (i - (count - 1) / 2) * 8}%`,
                zIndex: selectedId === card.id ? 30 : i,
              }}
            >
              <PlayingCard
                card={card}
                size="md"
                selected={selectedId === card.id}
                onClick={isInteractive && onPlay ? () => onPlay(card.id) : undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

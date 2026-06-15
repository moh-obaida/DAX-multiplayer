import { useEffect, useState } from "react";
import type { Card } from "../../types/game";
import PlayingCard from "../Common/PlayingCard";

interface CardHandProps {
  cards: Card[];
  onPlay?: (cardId: string) => void;
  isInteractive?: boolean;
}

export default function CardHand({ cards, onPlay, isInteractive = true }: CardHandProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const count = cards.length;
  const spread = Math.min(count * 12, 90);
  const startAngle = -spread / 2;

  useEffect(() => {
    if (!selectedId) return;
    const handler = (e: KeyboardEvent) => {
      const idx = cards.findIndex((c) => c.id === selectedId);
      if (e.key === "ArrowLeft" && idx > 0) setSelectedId(cards[idx - 1].id);
      if (e.key === "ArrowRight" && idx < cards.length - 1) setSelectedId(cards[idx + 1].id);
      if (e.key === " " && selectedId && onPlay) {
        e.preventDefault();
        onPlay(selectedId);
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId, cards, onPlay]);

  const handleClick = (cardId: string) => {
    if (!isInteractive || !onPlay) return;
    if (selectedId === cardId) {
      onPlay(cardId);
      setSelectedId(null);
    } else {
      setSelectedId(cardId);
    }
  };

  return (
    <div className="relative w-full flex justify-center items-end h-44 px-4 overflow-visible" role="list" aria-label="Your hand">
      <div className="relative flex justify-center transition-all duration-200" style={{ width: `${Math.max(count * 48, 200)}px`, height: "160px" }}>
        {cards.map((card, i) => {
          const angle = count <= 1 ? 0 : startAngle + (spread / Math.max(count - 1, 1)) * i;
          const lift = Math.abs(angle) * 0.35;
          return (
            <div
              key={card.id}
              className="absolute bottom-0 origin-bottom transition-transform duration-200"
              style={{
                transform: `rotate(${angle}deg) translateY(-${lift}px)`,
                left: `${50 + (i - (count - 1) / 2) * 7}%`,
                zIndex: selectedId === card.id ? 30 : i,
              }}
            >
              <PlayingCard
                card={card}
                size="md"
                selected={selectedId === card.id}
                onClick={isInteractive && onPlay ? () => handleClick(card.id) : undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

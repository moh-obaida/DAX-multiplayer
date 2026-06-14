import type { Player } from "../../types/game";
import PlayingCard from "./PlayingCard";

interface OpponentSeatProps {
  player: Player;
  position: "top" | "left" | "right" | "top-left" | "top-right";
}

const positionClasses = {
  top: "top-4 left-1/2 -translate-x-1/2",
  left: "left-4 top-1/2 -translate-y-1/2",
  right: "right-4 top-1/2 -translate-y-1/2",
  "top-left": "top-16 left-[12%]",
  "top-right": "top-16 right-[12%]",
};

export default function OpponentSeat({ player, position }: OpponentSeatProps) {
  const isActive = player.isCurrentTurn;

  return (
    <div className={`absolute ${positionClasses[position]} z-10`}>
      <div className={`dax-panel px-4 py-3 min-w-[140px] transition-all ${isActive ? "border-gold shadow-gold animate-pulse-gold" : "border-gold/15"}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-xs font-bold text-gold">
            {player.name[0]?.toUpperCase()}
          </span>
          <span className="text-sm font-medium text-ivory truncate max-w-[80px]">{player.name}</span>
        </div>
        <div className="flex items-center gap-1 justify-center">
          {Array.from({ length: Math.min(player.hand.length, 7) }).map((_, i) => (
            <div key={i} className="-ml-3 first:ml-0">
              <PlayingCard card={player.hand[0] || { id: `back-${i}`, color: "blue", type: "number", value: 0 }} faceDown size="xs" />
            </div>
          ))}
          {player.hand.length > 7 && (
            <span className="text-xs text-gold font-mono ml-1">+{player.hand.length - 7}</span>
          )}
        </div>
        <p className="text-center text-[10px] text-ivory-dim mt-1 font-mono">{player.hand.length} cards</p>
      </div>
    </div>
  );
}

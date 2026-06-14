import type { Player } from "../../types/game";
import Card from "./Card";

interface PlayerAreaProps {
  player: Player;
}

export default function PlayerArea({ player }: PlayerAreaProps) {
  return (
    <div
      className={`rounded-lg p-4 min-w-max backdrop-blur-sm transition-shadow
        bg-forest-panel/90 border
        ${player.isCurrentTurn
          ? "border-gold shadow-gold-sm"
          : "border-forest-border"
        }`}
    >
      <div className="text-white text-sm font-bold mb-2">{player.name}</div>
      <div className="text-gold-pale/60 text-xs mb-2">Cards: {player.hand.length}</div>
      <div className="flex gap-2 max-w-xs overflow-auto">
        {player.hand.slice(0, 5).map((card) => (
          <Card key={card.id} card={card} size="small" />
        ))}
        {player.hand.length > 5 && (
          <div className="text-gold-pale/50 text-xs flex items-center">+{player.hand.length - 5}</div>
        )}
      </div>
    </div>
  );
}

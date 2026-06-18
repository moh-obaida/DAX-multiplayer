import type { CSSProperties } from "react";
import { Eye } from "lucide-react";
import type { Player } from "../../types/game";
import type { PlayerSeatPosition } from "../../types/ui";
import Badge from "../Common/Badge";
import PlayingCard from "../Common/PlayingCard";

interface PlayerAreaProps {
  player: Player;
  position?: PlayerSeatPosition;
  seatStyle?: CSSProperties;
  isLocal: boolean;
  onCallOut?: () => void;
  canCallOut?: boolean;
}

const positionClasses: Record<PlayerSeatPosition, string> = {
  bottom: "bottom-4 left-1/2 -translate-x-1/2",
  top: "top-4 left-1/2 -translate-x-1/2",
  left: "left-4 top-1/2 -translate-y-1/2",
  right: "right-4 top-1/2 -translate-y-1/2",
  "top-left": "top-16 left-16",
  "top-right": "top-16 right-16",
};

export default function PlayerArea({ player, position = "top", seatStyle, isLocal, onCallOut, canCallOut }: PlayerAreaProps) {
  const statusVariant = player.isCurrentTurn ? "turn" : player.status === "finished" || player.status === "spectator" ? "spectator" : "waiting";
  const statusLabel = player.isCurrentTurn
    ? "Your turn"
    : player.status === "finished"
      ? "Finished"
      : player.status === "spectator"
        ? "Spectating"
        : "Waiting";

  return (
    <div
      className={seatStyle ? "absolute z-10 flex flex-col items-center gap-2 max-w-[140px]" : `absolute ${positionClasses[position]} z-10 flex flex-col items-center gap-2 max-w-[140px]`}
      style={seatStyle}
    >
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-board/90 border ${player.isCurrentTurn ? "border-gold shadow-gold-sm" : "border-gold/15"}`}>
        <span className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-display font-bold text-gold text-sm">
          {player.name[0]?.toUpperCase()}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ivory">{isLocal ? "You" : player.name}</span>
            {player.isHost && <Badge label="Host" variant="host" />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge
              label={statusLabel}
              variant={statusVariant}
              pulse={player.isCurrentTurn}
            />
            {player.status === "spectator" && <Eye size={12} className="text-ivory-dim" />}
          </div>
        </div>
      </div>

      {!isLocal && (
        <div className="flex -space-x-6">
          {Array.from({ length: Math.min(player.hand.length, 5) }).map((_, i) => (
            <PlayingCard
              key={i}
              card={{ id: `back-${i}`, color: "blue", type: "number", value: 0 }}
              faceDown
              size="sm"
            />
          ))}
          {player.hand.length > 5 && (
            <span className="self-center text-xs text-gold font-display ml-2">+{player.hand.length - 5}</span>
          )}
        </div>
      )}

      {canCallOut && onCallOut && player.hand.length === 1 && !player.hasCalledUno && (
        <button
          type="button"
          onClick={onCallOut}
          className="text-[10px] uppercase tracking-wider text-red border border-red/40 px-2 py-1 rounded-lg hover:bg-red/10"
        >
          Call UNO!
        </button>
      )}
    </div>
  );
}

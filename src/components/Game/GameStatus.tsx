import { useEffect, useState } from "react";
import type { GameState } from "../../types/game";

interface GameStatusProps {
  game: GameState;
}

export default function GameStatus({ game }: GameStatusProps) {
  const [timer, setTimer] = useState(game.turnTimer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentPlayer = game.players[game.currentPlayerIndex];
  const timerColor = timer > 20 ? "bg-green" : timer > 10 ? "bg-yellow" : "bg-red";

  return (
    <div className="relative z-20 shrink-0">
      <div className="dax-gold-line" />
      <div className="bg-forest-panel/90 backdrop-blur-sm px-5 py-3.5 flex justify-between items-center border-t border-forest-border">
        <div className="text-gold-pale/80 text-sm">
          <span className="text-gold-pale/40 uppercase text-[10px] tracking-wider mr-2">Turn</span>
          {currentPlayer?.name}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white text-xl font-bold tabular-nums">{timer}s</div>
          <div className={`w-32 h-1 rounded-full ${timerColor}`} />
        </div>
        <div className="text-gold-pale/60 text-sm">
          <span className="text-gold-pale/40 uppercase text-[10px] tracking-wider mr-2">Players</span>
          {game.players.length}/8
        </div>
      </div>
    </div>
  );
}

import type { GameState } from "../../types/game";
import { calculateScores } from "../../lib/gameLogic";
import Button from "../UI/Button";
import Badge from "../Common/Badge";

interface GameEndProps {
  game: GameState;
  localPlayerId: string;
  onRematch?: () => void;
}

export default function GameEnd({ game, localPlayerId, onRematch }: GameEndProps) {
  const scores = calculateScores(game);
  const iWon = game.winners.includes(localPlayerId);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="dax-panel-glow p-8 max-w-lg mx-4 w-full border border-gold/40">
        <p className="text-gold text-xs uppercase tracking-[0.3em] mb-2 text-center">Game Over</p>
        <h2 className="font-display text-3xl font-bold text-ivory mb-6 text-center">
          {iWon ? "You Win!" : "Match Finished"}
        </h2>

        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="text-ivory-dim text-left border-b border-gold/20">
              <th className="pb-2">Player</th>
              <th className="pb-2">Cards</th>
              <th className="pb-2 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s.playerId} className="border-b border-gold/10">
                <td className="py-2 text-ivory flex items-center gap-2">
                  {s.playerName}
                  {i === 0 && <Badge label="Winner" variant="host" />}
                  {s.playerId === localPlayerId && <Badge label="You" variant="default" />}
                </td>
                <td className="py-2 text-ivory-muted">{s.cardsRemaining}</td>
                <td className="py-2 text-gold text-right font-display">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRematch && <Button variant="primary" onClick={onRematch}>Rematch</Button>}
          <Button variant="secondary" to="/play">Lobby</Button>
          <Button variant="ghost" to="/">Main Menu</Button>
        </div>
      </div>
    </div>
  );
}

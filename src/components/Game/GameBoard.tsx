import { useGameStore } from "../../store/gameStore";
import DaxBrand from "../UI/DaxBrand";
import PlayerArea from "./PlayerArea";
import DiscardPile from "./DiscardPile";
import GameStatus from "./GameStatus";

export default function GameBoard() {
  const game = useGameStore((state) => state.game);

  if (!game) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <DaxBrand variant="loading" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center relative">
        <DaxBrand variant="watermark" />

        <div className="relative w-full h-full flex items-center justify-center z-[1]">
          {game.players.map((player, index) => {
            const angle = (index / game.players.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 300;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={player.id}
                className="absolute"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              >
                <PlayerArea player={player} />
              </div>
            );
          })}

          <div className="absolute z-10 flex flex-col items-center gap-4">
            <DiscardPile discardPile={game.discardPile} />
          </div>
        </div>
      </div>

      <GameStatus game={game} />
    </div>
  );
}

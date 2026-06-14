import type { Card } from "../../types/game";
import PlayingCard from "../Game/PlayingCard";

const DISCARD_TOP: Card = { id: "p-disc", color: "red", type: "number", value: 7 };
const DRAW_BACK: Card = { id: "p-draw", color: "blue", type: "number", value: 0 };

const HAND_PREVIEW: Card[] = [
  { id: "h1", color: "blue", type: "number", value: 3 },
  { id: "h2", color: "yellow", type: "number", value: 3 },
  { id: "h3", color: "green", type: "draw2" },
  { id: "h4", color: "red", type: "skip" },
  { id: "h5", color: "blue", type: "wild" },
  { id: "h6", color: "yellow", type: "number", value: 8 },
  { id: "h7", color: "green", type: "number", value: 2 },
];

function AvatarBubble({
  name,
  avatar,
  status,
  active,
}: {
  name: string;
  avatar: string;
  status: "online" | "away";
  active?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-1.5 ${active ? "scale-105" : ""}`}>
      <div
        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-display font-bold text-sm
        ${active ? "bg-gold/25 border-2 border-gold shadow-gold-sm text-gold" : "bg-emerald-dark/80 border border-gold/30 text-ivory"}`}
      >
        {avatar}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-emerald-dark
          ${status === "online" ? "bg-green shadow-[0_0_6px_rgba(67,160,71,0.9)]" : "bg-yellow"}`}
        />
      </div>
      <span className="text-[10px] sm:text-xs text-ivory-muted font-medium max-w-[64px] truncate">{name}</span>
    </div>
  );
}

function OpponentHandStack({ count }: { count: number }) {
  return (
    <div className="flex -space-x-4">
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <div key={i} style={{ transform: `rotate(${(i - 2) * 4}deg)` }}>
          <PlayingCard card={DRAW_BACK} faceDown size="xs" />
        </div>
      ))}
    </div>
  );
}

export default function LobbyTablePreview() {
  return (
    <div className="lobby-table-scene relative w-full max-w-2xl mx-auto aspect-[4/3] sm:aspect-[16/11]">
      <div className="lobby-table-surface absolute inset-[8%] sm:inset-[6%] rounded-[50%] dax-felt border border-gold/25 shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_2px_20px_rgba(212,175,55,0.08)]">
        <div className="absolute inset-0 rounded-[50%] border border-gold/10 scale-[0.92]" />
        <div className="absolute inset-0 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_35%,rgba(212,175,55,0.07)_0%,transparent_55%)]" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-4 sm:gap-6">
        <div className="relative lobby-pile-float">
          <PlayingCard card={DRAW_BACK} faceDown size="sm" />
          <span className="absolute -bottom-1 -right-1 text-[9px] font-mono bg-emerald-dark border border-gold/40 text-gold px-1.5 py-0.5 rounded">
            42
          </span>
        </div>
        <div className="relative lobby-pile-float" style={{ animationDelay: "0.5s" }}>
          <PlayingCard card={DISCARD_TOP} size="sm" />
        </div>
      </div>

      <div className="absolute top-[2%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <AvatarBubble name="NadiaK" avatar="N" status="online" />
        <OpponentHandStack count={5} />
      </div>

      <div className="absolute left-[2%] sm:left-[4%] top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
        <AvatarBubble name="OmarP" avatar="O" status="online" />
        <div className="-rotate-90 origin-center">
          <OpponentHandStack count={6} />
        </div>
      </div>

      <div className="absolute right-[2%] sm:right-[4%] top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
        <AvatarBubble name="ZaraC" avatar="Z" status="away" active />
        <div className="rotate-90 origin-center">
          <OpponentHandStack count={4} />
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 w-full flex flex-col items-center">
        <AvatarBubble name="You" avatar="Y" status="online" active />
        <div className="relative flex justify-center items-end h-20 sm:h-24 mt-1 w-full max-w-md px-2">
          {HAND_PREVIEW.map((card, i) => {
            const n = HAND_PREVIEW.length;
            const angle = -28 + (56 / (n - 1)) * i;
            return (
              <div
                key={card.id}
                className="absolute bottom-0 origin-bottom lobby-card-float"
                style={{
                  transform: `rotate(${angle}deg) translateY(${-Math.abs(i - (n - 1) / 2) * 2}px)`,
                  left: `${50 + (i - (n - 1) / 2) * 7}%`,
                  zIndex: i,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <PlayingCard card={card} size="xs" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute top-[18%] right-[18%] z-20 dax-badge text-[10px] animate-pulse-gold">
        Zara&apos;s turn · 24s
      </div>
    </div>
  );
}

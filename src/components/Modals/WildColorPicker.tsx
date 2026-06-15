import { useEffect, useState } from "react";
import type { CardColor } from "../../types/game";
import { COLOR_LABELS } from "../../types/ui";
import { SUIT_COLORS, WILD_PICK_SECONDS } from "../../lib/constants";

interface WildColorPickerProps {
  deadline: number;
  onSelect: (color: CardColor) => void;
  onTimeout: () => void;
}

const COLORS: CardColor[] = ["red", "yellow", "green", "blue"];

export default function WildColorPicker({ deadline, onSelect, onTimeout }: WildColorPickerProps) {
  const [remaining, setRemaining] = useState(WILD_PICK_SECONDS);

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) onTimeout();
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [deadline, onTimeout]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" role="dialog" aria-label="Choose wild color">
      <div className="dax-panel-glow p-6 max-w-sm mx-4 border border-gold/40 text-center">
        <p className="text-gold text-xs uppercase tracking-widest mb-1">Wild Card</p>
        <h3 className="font-display text-xl font-bold text-ivory mb-2">Choose a Color</h3>
        <p className="text-sm text-ivory-dim mb-4 tabular-nums">{remaining}s remaining</p>
        <div className="grid grid-cols-2 gap-3">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onSelect(c)}
              className="flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-black font-display font-bold text-white hover:scale-105 transition-transform"
              style={{ backgroundColor: SUIT_COLORS[c] }}
              aria-label={COLOR_LABELS[c]}
            >
              {COLOR_LABELS[c]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

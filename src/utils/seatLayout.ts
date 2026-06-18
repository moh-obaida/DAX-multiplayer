import type { CSSProperties } from "react";

/** Positions opponents around the table (local player sits at bottom). Supports 1–7 opponents (2–8 players). */
export function getOpponentSeatStyles(opponentCount: number): CSSProperties[] {
  if (opponentCount <= 0) return [];

  const radius = 44;
  const centerX = 50;
  const centerY = 46;

  if (opponentCount === 1) {
    return [{ left: "50%", top: "8%", transform: "translate(-50%, 0)" }];
  }

  const startDeg = 205;
  const endDeg = 335;
  const styles: CSSProperties[] = [];

  for (let i = 0; i < opponentCount; i++) {
    const angleDeg = startDeg + (i / (opponentCount - 1)) * (endDeg - startDeg);
    const rad = (angleDeg * Math.PI) / 180;
    const x = centerX + radius * Math.cos(rad);
    const y = centerY + radius * Math.sin(rad);
    styles.push({
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
    });
  }

  return styles;
}

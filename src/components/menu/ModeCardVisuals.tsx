/** Styled SVG visuals for mode cards — no emoji artwork */

export type ModeVisualId = "quick" | "private" | "join" | "friends" | "tutorial" | "custom";

export function ModeCardVisual({ id, large }: { id: ModeVisualId; large?: boolean }) {
  const h = large ? 88 : 64;
  const w = large ? 100 : 72;

  switch (id) {
    case "quick":
      return <QuickMatchVisual w={w} h={h} />;
    case "private":
      return <PrivateRoomVisual w={w} h={h} />;
    case "join":
      return <JoinCodeVisual w={w} h={h} />;
    case "friends":
      return <FriendsVisual w={w} h={h} />;
    case "tutorial":
      return <TutorialVisual w={w} h={h} />;
    case "custom":
      return <CustomRulesVisual w={w} h={h} />;
  }
}

function MiniCard({ x, y, color, rotate = 0 }: { x: number; y: number; color: string; rotate?: number }) {
  return (
    <rect
      x={x}
      y={y}
      width="18"
      height="26"
      rx="3"
      fill={color}
      stroke="rgba(212,175,55,0.4)"
      strokeWidth="1"
      transform={`rotate(${rotate} ${x + 9} ${y + 13})`}
    />
  );
}

function QuickMatchVisual({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 100 88" fill="none" aria-hidden>
      <defs>
        <filter id="goldGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M50 8 L58 32 H82 L62 46 L70 70 L50 54 L30 70 L38 46 L18 32 H42 Z" fill="#d4af37" filter="url(#goldGlow)" opacity="0.95" />
      <MiniCard x={62} y={48} color="#1e88e5" rotate={12} />
      <MiniCard x={48} y={52} color="#e53935" rotate={-8} />
      <MiniCard x={34} y={50} color="#43a047" rotate={6} />
      <rect x="22" y="58" width="18" height="26" rx="3" fill="#fdd835" stroke="rgba(212,175,55,0.5)" strokeWidth="1" transform="rotate(-15 31 71)" />
    </svg>
  );
}

function PrivateRoomVisual({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 72 64" fill="none" aria-hidden>
      <ellipse cx="36" cy="38" rx="28" ry="16" fill="#1a3a2e" stroke="#d4af37" strokeWidth="1.5" opacity="0.9" />
      <MiniCard x={28} y={22} color="#e53935" />
      <MiniCard x={44} y={20} color="#1e88e5" rotate={8} />
      <rect x="30" y="8" width="12" height="14" rx="2" fill="none" stroke="#d4af37" strokeWidth="2" />
      <path d="M33 14 h6 v4 h-6z M36 11 v-2" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function JoinCodeVisual({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 72 64" fill="none" aria-hidden>
      <rect x="8" y="14" width="56" height="36" rx="6" fill="#0a1e12" stroke="#d4af37" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={14 + i * 8} y="26" width="6" height="10" rx="1" fill="#1a3a2e" stroke="#d4af37" strokeWidth="0.75" opacity="0.9" />
      ))}
      <text x="36" y="24" textAnchor="middle" fill="#d4af37" fontSize="7" fontFamily="monospace">######</text>
    </svg>
  );
}

function FriendsVisual({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 72 64" fill="none" aria-hidden>
      {[
        { cx: 22, cy: 22, r: 8 },
        { cx: 36, cy: 18, r: 9 },
        { cx: 50, cy: 22, r: 8 },
      ].map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="#1a3a2e" stroke="#d4af37" strokeWidth="1.5" />
      ))}
      <MiniCard x={20} y={38} color="#43a047" rotate={-10} />
      <MiniCard x={36} y={36} color="#fdd835" />
      <MiniCard x={48} y={40} color="#e53935" rotate={10} />
    </svg>
  );
}

function TutorialVisual({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 72 64" fill="none" aria-hidden>
      <path d="M12 8 h32 a4 4 0 014 4 v36 a4 4 0 01-4 4 H12 V8z" fill="#1a3a2e" stroke="#d4af37" strokeWidth="1.5" />
      <path d="M44 12 h8 a4 4 0 014 4 v32 a4 4 0 01-4 4 H44 V12z" fill="#0f2818" stroke="#d4af37" strokeWidth="1" opacity="0.7" />
      <line x1="18" y1="20" x2="38" y2="20" stroke="#f5f1e8" strokeWidth="1.5" opacity="0.6" />
      <line x1="18" y1="28" x2="34" y2="28" stroke="#f5f1e8" strokeWidth="1" opacity="0.4" />
      <MiniCard x={46} y={28} color="#1e88e5" rotate={5} />
      <MiniCard x={52} y={34} color="#e53935" rotate={-5} />
    </svg>
  );
}

function CustomRulesVisual({ w, h }: { w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 72 64" fill="none" aria-hidden>
      <rect x="10" y="12" width="52" height="8" rx="4" fill="#1a3a2e" stroke="#d4af37" strokeWidth="1" />
      <circle cx="50" cy="16" r="4" fill="#d4af37" />
      <rect x="10" y="26" width="52" height="8" rx="4" fill="#1a3a2e" stroke="#d4af37" strokeWidth="1" />
      <circle cx="22" cy="30" r="4" fill="#6b655c" stroke="#d4af37" strokeWidth="1" />
      <rect x="38" y="38" width="24" height="18" rx="4" fill="url(#wildGrad)" stroke="#d4af37" strokeWidth="1.5" />
      <text x="50" y="50" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">W</text>
      <defs>
        <linearGradient id="wildGrad" x1="38" y1="38" x2="62" y2="56">
          <stop stopColor="#7c3aed" /><stop offset="1" stopColor="#db2777" />
        </linearGradient>
      </defs>
    </svg>
  );
}

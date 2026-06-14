/** Floating card silhouettes — subtle arena atmosphere */
export default function GameMenuBackground() {
  const floats = [
    { left: "6%", top: "22%", rotate: -18, color: "#e53935", delay: "0s" },
    { left: "88%", top: "28%", rotate: 14, color: "#1e88e5", delay: "1.2s" },
    { left: "12%", top: "62%", rotate: 8, color: "#fdd835", delay: "0.6s" },
    { left: "82%", top: "58%", rotate: -12, color: "#43a047", delay: "1.8s" },
    { left: "48%", top: "12%", rotate: 6, color: "#7c3aed", delay: "2.4s", opacity: 0.04 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_45%,rgba(26,58,46,0.55)_0%,transparent_70%)]" />
      {floats.map((f, i) => (
        <div
          key={i}
          className="menu-float-card absolute w-12 h-[4.5rem] rounded-lg border border-gold/10"
          style={{
            left: f.left,
            top: f.top,
            transform: `rotate(${f.rotate}deg)`,
            backgroundColor: f.color,
            opacity: f.opacity ?? 0.06,
            animationDelay: f.delay,
          }}
        />
      ))}
    </div>
  );
}

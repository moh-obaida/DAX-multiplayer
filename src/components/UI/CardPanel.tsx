interface CardPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  highlight?: boolean;
  glow?: boolean;
}

export default function CardPanel({ children, className = "", title, highlight, glow }: CardPanelProps) {
  return (
    <div className={`${glow || highlight ? "dax-panel-glow" : "dax-panel"} p-5 ${highlight ? "border-gold/40 shadow-gold-sm" : ""} ${className}`}>
      {title && (
        <h3 className="font-display text-xs uppercase tracking-[0.2em] text-gold mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-gold rounded-full" />
          {title}
        </h3>
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { ModeCardVisual, type ModeVisualId } from "./ModeCardVisuals";

interface ModeCardProps {
  title: string;
  subtitle: string;
  visual: ModeVisualId;
  to?: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
  className?: string;
}

export default function ModeCard({
  title,
  subtitle,
  visual,
  to,
  href,
  onClick,
  primary,
  className = "",
}: ModeCardProps) {
  const classes = `mode-card group relative flex flex-col rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300
    hover:-translate-y-1 active:scale-[0.99]
    ${primary
      ? "mode-card-primary bg-gradient-to-br from-gold/25 via-board to-emerald-dark border-gold/60 shadow-gold"
      : "bg-gradient-to-b from-board-light/50 via-board/80 to-emerald-dark border-gold/25 hover:border-gold/45 hover:shadow-gold-sm"
    }
    ${className}`;

  const inner = (
    <>
      {primary && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.2)_0%,transparent_65%)] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gold/80" />
        </>
      )}
      <div className="relative z-[1] flex flex-col items-center justify-center flex-1 p-4 min-h-0">
        <div className={`mb-3 transition-transform duration-300 group-hover:scale-105 ${primary ? "drop-shadow-[0_0_16px_rgba(212,175,55,0.45)]" : ""}`}>
          <ModeCardVisual id={visual} large={primary} />
        </div>
        <h3 className={`font-display font-bold text-center leading-tight ${primary ? "text-lg text-gold" : "text-sm text-ivory"}`}>
          {title}
        </h3>
        <p className="text-[10px] sm:text-xs text-ivory-dim text-center mt-1.5 leading-snug max-w-[140px]">{subtitle}</p>
        {primary && (
          <span className="mt-3 px-4 py-1.5 rounded-full bg-gold text-emerald-dark text-[10px] font-display font-bold uppercase tracking-widest shadow-gold-sm group-hover:scale-105 transition-transform">
            Play Now
          </span>
        )}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${primary ? "bg-gold" : "bg-gold/20 group-hover:bg-gold/50"} transition-colors`} />
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {inner}
      </button>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to ?? "/play"} className={classes}>
      {inner}
    </Link>
  );
}

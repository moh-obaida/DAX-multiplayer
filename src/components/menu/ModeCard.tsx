import { Link } from "react-router-dom";

interface ModeCardProps {
  title: string;
  subtitle: string;
  icon: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  featured?: boolean;
  accent?: "gold" | "board" | "emerald";
}

const accents = {
  gold: "from-gold/20 via-board to-emerald-dark border-gold/50 shadow-gold-sm",
  board: "from-board-light/40 via-board to-emerald-dark border-gold/25",
  emerald: "from-emerald-light/30 via-emerald to-emerald-dark border-gold/20",
};

export default function ModeCard({ title, subtitle, icon, to, href, onClick, featured, accent = "board" }: ModeCardProps) {
  const classes = `mode-card group relative flex flex-col items-center justify-between w-[140px] sm:w-[160px] md:w-[172px] h-[220px] sm:h-[260px] md:h-[280px] rounded-2xl border bg-gradient-to-b p-4 cursor-pointer transition-all duration-300
    hover:-translate-y-2 hover:shadow-gold hover:border-gold/60 active:scale-[0.98]
    ${featured ? "mode-card-featured " + accents.gold : accents[accent]}`;

  const inner = (
    <>
      {featured && <div className="absolute inset-0 rounded-2xl bg-gold/5 animate-pulse-gold pointer-events-none" />}
      <div className="relative z-[1] w-full flex flex-col items-center flex-1">
        <div className={`text-4xl sm:text-5xl mb-3 transition-transform group-hover:scale-110 ${featured ? "drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]" : ""}`}>
          {icon}
        </div>
        <h3 className={`font-display text-sm sm:text-base font-bold text-center leading-tight ${featured ? "text-gold" : "text-ivory"}`}>
          {title}
        </h3>
        <p className="text-[10px] sm:text-xs text-ivory-dim text-center mt-2 leading-snug">{subtitle}</p>
      </div>
      <div className="relative z-[1] w-full mt-auto pt-3">
        <div className={`h-1 rounded-full ${featured ? "bg-gold/60" : "bg-gold/20 group-hover:bg-gold/40"} transition-colors`} />
      </div>
      {/* Decorative card corner */}
      <div className="absolute top-2 right-2 w-6 h-8 rounded-sm border border-gold/20 bg-emerald-dark/50 opacity-40 rotate-6 group-hover:opacity-70 transition-opacity" />
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

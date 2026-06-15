interface BadgeProps {
  label: string;
  variant?: "default" | "turn" | "waiting" | "spectator" | "host";
  pulse?: boolean;
}

const variants = {
  default: "bg-gold/10 border-gold/30 text-gold",
  turn: "bg-green/20 border-green text-green",
  waiting: "bg-ivory-dim/20 border-ivory-dim text-ivory-dim",
  spectator: "bg-blue/20 border-blue text-blue",
  host: "bg-gold/20 border-gold text-gold",
};

export default function Badge({ label, variant = "default", pulse }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${variants[variant]} ${pulse ? "animate-pulse" : ""}`}
    >
      {label}
    </span>
  );
}

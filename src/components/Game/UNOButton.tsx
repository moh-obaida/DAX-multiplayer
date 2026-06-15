interface UNOButtonProps {
  onClick: () => void;
  disabled?: boolean;
  canCall: boolean;
}

export default function UNOButton({ onClick, disabled, canCall }: UNOButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Call UNO"
      className={`px-5 py-2 rounded-xl font-display font-bold text-lg uppercase tracking-wider border-2 transition-all duration-200
        ${canCall
          ? "bg-gold border-gold text-emerald shadow-gold hover:scale-105 animate-pulse"
          : "bg-board border-gold/30 text-ivory-dim opacity-60"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      UNO!
    </button>
  );
}

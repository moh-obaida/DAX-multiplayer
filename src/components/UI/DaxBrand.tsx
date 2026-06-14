interface DaxBrandProps {
  variant?: "header" | "loading" | "watermark";
}

export default function DaxBrand({ variant = "header" }: DaxBrandProps) {
  if (variant === "watermark") {
    return (
      <div className="dax-brand-watermark" aria-hidden="true">
        <img src="/brand/dax-icon.png" alt="" />
      </div>
    );
  }

  if (variant === "loading") {
    return (
      <div className="flex flex-col items-center gap-5">
        <img
          src="/brand/dax-icon.png"
          alt="DAX"
          className="dax-brand-icon dax-loading-pulse w-24 h-24 object-contain"
        />
        <img
          src="/brand/dax-wordmark.png"
          alt="DAX"
          className="h-7 w-auto opacity-80"
        />
        <p className="text-gold-pale/50 text-xs tracking-[0.25em] uppercase">Loading table</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 select-none">
      <img
        src="/brand/dax-icon.png"
        alt=""
        className="dax-brand-icon"
        aria-hidden="true"
      />
      <img
        src="/brand/dax-wordmark.png"
        alt="DAX"
        className="dax-brand-wordmark hidden sm:block"
      />
    </div>
  );
}

interface DaxBrandProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "wordmark" | "icon";
  showWordmark?: boolean;
}

export default function DaxBrand({ size = "md", variant, showWordmark = true }: DaxBrandProps) {
  const iconSize = { sm: "h-7", md: "h-9", lg: "h-11", xl: "h-14" }[size];
  const wordSize = { sm: "h-4", md: "h-5", lg: "h-6", xl: "h-8" }[size];
  const fullSize = { sm: "h-8", md: "h-10", lg: "h-12", xl: "h-16" }[size];

  if (variant === "full") {
    return (
      <img src="/logos/dax-full.png" alt="DAX" className={`${fullSize} w-auto`} loading="lazy" />
    );
  }

  if (variant === "wordmark") {
    return <img src="/logos/dax-wordmark.png" alt="DAX" className={`${wordSize} w-auto`} loading="lazy" />;
  }

  if (variant === "icon") {
    return <img src="/logos/dax-icon.png" alt="DAX" className={`${iconSize} w-auto`} width={36} height={36} />;
  }

  return (
    <div className="flex items-center gap-2.5">
      <img src="/logos/dax-icon.png" alt="" className={`${iconSize} w-auto`} aria-hidden="true" width={36} height={36} />
      {showWordmark && (
        <img
          src="/logos/dax-wordmark.png"
          alt="DAX"
          className={`${wordSize} w-auto ${size === "xl" ? "block" : "hidden sm:block"}`}
          loading="lazy"
        />
      )}
    </div>
  );
}

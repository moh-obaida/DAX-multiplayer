interface DaxBrandProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
}

export default function DaxBrand({ size = "md", showWordmark = true }: DaxBrandProps) {
  const iconSize = { sm: "h-7", md: "h-9", lg: "h-11", xl: "h-14" }[size];
  const wordSize = { sm: "h-4", md: "h-5", lg: "h-6", xl: "h-8" }[size];

  return (
    <div className="flex items-center gap-2.5">
      <img src="/brand/dax-icon.png" alt="" className={`${iconSize} w-auto`} aria-hidden="true" />
      {showWordmark && (
        <img src="/brand/dax-wordmark.png" alt="DAX" className={`${wordSize} w-auto ${size === "xl" ? "block" : "hidden sm:block"}`} />
      )}
    </div>
  );
}

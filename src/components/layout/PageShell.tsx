interface PageShellProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "full";
}

const widths = { md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl", full: "max-w-7xl" };

export default function PageShell({ title, subtitle, children, maxWidth = "xl" }: PageShellProps) {
  return (
    <div className={`${widths[maxWidth]} mx-auto px-4 sm:px-6 py-8 sm:py-12`}>
      {(title || subtitle) && (
        <header className="mb-8">
          {title && <h1 className="text-2xl sm:text-3xl font-bold text-ivory">{title}</h1>}
          {subtitle && <p className="text-ivory-muted mt-2">{subtitle}</p>}
        </header>
      )}
      {children}
    </div>
  );
}

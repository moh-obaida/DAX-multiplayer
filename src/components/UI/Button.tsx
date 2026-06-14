import { Link } from "react-router-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "neon";
  size?: "sm" | "md" | "lg";
  to?: string;
  fullWidth?: boolean;
}

const variants = {
  primary: "dax-btn-primary",
  secondary: "dax-btn-secondary",
  ghost: "text-ivory-muted hover:text-gold hover:bg-gold/5 px-4 py-2 rounded-lg transition-all font-medium",
  danger: "bg-red/90 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-red transition-all",
  neon: "font-display uppercase tracking-wider text-sm border border-gold text-gold px-5 py-2.5 rounded-lg shadow-neon hover:shadow-gold transition-all",
};

const sizes = {
  sm: "!px-3 !py-1.5 !text-xs",
  md: "",
  lg: "!px-10 !py-4 !text-base",
};

export default function Button({ variant = "primary", size = "md", to, fullWidth, className = "", children, ...props }: ButtonProps) {
  const classes = `${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${className}`;

  if (to) return <Link to={to} className={classes}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}

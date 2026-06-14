import { Link, NavLink } from "react-router-dom";
import DaxBrand from "../UI/DaxBrand";
import Button from "../UI/Button";
import { useAuthStore } from "../../store/authStore";
import { getHelpPath, isExternalHelpUrl, getHelpUrl } from "../../utils/urls";

const links = [
  { to: "/play", label: "Play" },
  { to: "/friends", label: "Friends" },
  isExternalHelpUrl()
    ? { href: getHelpUrl(), label: "Rules", external: true as const }
    : { to: getHelpPath(), label: "Rules", external: false as const },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <nav className="sticky top-0 z-50 border-b border-gold/15 bg-emerald-dark/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-[4.25rem] flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0 hover:opacity-90 transition-opacity">
            <DaxBrand size="sm" />
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-board/40 rounded-xl p-1 border border-gold/10">
            {links.map((l) =>
              "external" in l && l.external ? (
                <a key={l.label} href={l.href} className="px-4 py-2 rounded-lg text-sm font-medium text-ivory-muted hover:text-gold transition-colors">
                  {l.label}
                </a>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to!}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? "bg-gold/15 text-gold shadow-gold-sm" : "text-ivory-muted hover:text-ivory"}`
                  }
                >
                  {l.label}
                </NavLink>
              )
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gold/20 hover:border-gold/40 transition-colors">
                <span className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-xs font-bold text-gold">
                  {user.username[0]?.toUpperCase()}
                </span>
                <span className="text-sm text-ivory">{user.username}</span>
              </Link>
            ) : (
              <>
                <Button variant="ghost" size="sm" to="/login">Log in</Button>
                <Button variant="secondary" size="sm" to="/register" className="hidden sm:inline-flex">Sign up</Button>
              </>
            )}
            <Button variant="primary" size="sm" to="/play">Play Now</Button>
          </div>
        </div>
      </div>
      <div className="dax-gold-line opacity-40" />
    </nav>
  );
}

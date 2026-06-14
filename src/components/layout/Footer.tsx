import { Link } from "react-router-dom";
import DaxBrand from "../UI/DaxBrand";
import { getHelpUrl } from "../../utils/urls";

export default function Footer() {
  const help = getHelpUrl();
  return (
    <footer className="relative mt-auto border-t border-gold/10 bg-emerald-dark">
      <div className="absolute inset-0 game-grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <DaxBrand size="sm" />
            <p className="text-ivory-dim text-xs mt-3 leading-relaxed">UNO-inspired. DAX rules. Halal · Ad-free · No gambling.</p>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-gold mb-4">Play</h4>
            <ul className="space-y-2 text-sm text-ivory-muted">
              <li><Link to="/play" className="hover:text-gold transition-colors">Quick Match</Link></li>
              <li><Link to="/play" className="hover:text-gold transition-colors">Private Room</Link></li>
              <li><Link to="/friends" className="hover:text-gold transition-colors">Friends</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-gold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-ivory-muted">
              <li><a href={help} className="hover:text-gold transition-colors">Help Center</a></li>
              <li><a href={`${help}#playing`} className="hover:text-gold transition-colors">Rules</a></li>
              <li><a href={`${help}#faq`} className="hover:text-gold transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-gold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-ivory-muted">
              <li><a href={`${help}#privacy`} className="hover:text-gold transition-colors">Privacy</a></li>
              <li><a href={`${help}#terms`} className="hover:text-gold transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-widest text-gold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-ivory-muted">
              <li>Real-time multiplayer</li>
              <li>Colorblind mode</li>
              <li>Achievements</li>
            </ul>
          </div>
        </div>
        <div className="dax-gold-line mb-6 opacity-30" />
        <p className="text-center text-xs text-ivory-dim font-mono">© {new Date().getFullYear()} DAX MULTIPLAYER · ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
}

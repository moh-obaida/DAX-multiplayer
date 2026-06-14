import { useNavigate } from "react-router-dom";
import GameMenuShell from "../components/menu/GameMenuShell";
import ModeCard from "../components/menu/ModeCard";
import Modal from "../components/UI/Modal";
import { useRoomStore } from "../store/roomStore";
import { useToastStore } from "../store/toastStore";
import { getHelpUrl } from "../utils/urls";
import { useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [joinOpen, setJoinOpen] = useState(false);
  const [code, setCode] = useState("");
  const setJoinCode = useRoomStore((s) => s.setJoinCode);
  const addToast = useToastStore((s) => s.add);

  const handleQuickMatch = () => {
    addToast("Finding a table…", "info");
    setTimeout(() => navigate("/game/quick-match"), 600);
  };

  const handleJoin = () => {
    if (code.length !== 6) {
      addToast("Enter a 6-digit room code", "error");
      return;
    }
    setJoinCode(code);
    setJoinOpen(false);
    navigate("/play");
  };

  return (
    <GameMenuShell activeNav="home">
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 px-3 sm:px-6 pb-2">
        <p className="font-display text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gold/70 mb-4 sm:mb-6">
          Select Mode
        </p>

        <div className="mode-card-row w-full max-w-5xl overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex items-stretch justify-center gap-3 sm:gap-4 md:gap-5 min-w-min mx-auto px-1">
            <ModeCard
              title="Quick Match"
              subtitle="Jump into a live table"
              icon="⚡"
              featured
              accent="gold"
              onClick={handleQuickMatch}
            />
            <ModeCard
              title="Private Room"
              subtitle="Host friends & rules"
              icon="🔐"
              to="/play"
              accent="board"
            />
            <ModeCard
              title="Join Code"
              subtitle="Enter 6-digit room"
              icon="#"
              accent="emerald"
              onClick={() => setJoinOpen(true)}
            />
            <ModeCard
              title="Play With Friends"
              subtitle="Invite your crew"
              icon="👥"
              to="/friends"
              accent="board"
            />
            <ModeCard
              title="Tutorial"
              subtitle="Learn DAX rules"
              icon="📖"
              href={getHelpUrl()}
              accent="emerald"
            />
            <ModeCard
              title="Custom Rules"
              subtitle="House rules & hands"
              icon="⚙"
              to="/play"
              accent="board"
            />
          </div>
        </div>

        <p className="mt-4 sm:mt-6 text-[10px] text-ivory-dim/70 uppercase tracking-widest">
          Halal · Ad-free · No gambling
        </p>
      </div>

      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Join Private Room">
        <p className="text-sm text-ivory-muted mb-4">Enter the 6-digit code from your host.</p>
        <input
          className="dax-input font-mono text-2xl text-center tracking-[0.4em] mb-4"
          maxLength={6}
          placeholder="000000"
          value={code}
          autoFocus
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        <button type="button" onClick={handleJoin} className="dax-btn-primary w-full">
          Join Table
        </button>
      </Modal>
    </GameMenuShell>
  );
}

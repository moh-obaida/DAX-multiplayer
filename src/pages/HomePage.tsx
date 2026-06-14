import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameMenuShell from "../components/menu/GameMenuShell";
import ModeCard from "../components/menu/ModeCard";
import Modal from "../components/UI/Modal";
import { useRoomStore } from "../store/roomStore";
import { useToastStore } from "../store/toastStore";
import { getHelpUrl } from "../utils/urls";

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
      <div className="menu-container flex flex-col justify-center flex-1 py-4 sm:py-6 min-h-0">
        <h2 className="font-display text-xs sm:text-sm uppercase tracking-[0.4em] text-gold text-center mb-4 sm:mb-5">
          Select Mode
        </h2>

        {/* Responsive grid — no horizontal scroll, no clipped cards */}
        <div className="mode-grid w-full">
          <ModeCard
            className="mode-grid-quick"
            title="Quick Match"
            subtitle="Jump into a live table now"
            visual="quick"
            primary
            onClick={handleQuickMatch}
          />
          <ModeCard
            title="Private Room"
            subtitle="Host friends & rules"
            visual="private"
            to="/play"
          />
          <ModeCard
            title="Join Code"
            subtitle="Enter 6-digit room"
            visual="join"
            onClick={() => setJoinOpen(true)}
          />
          <ModeCard
            title="Play With Friends"
            subtitle="Invite your crew"
            visual="friends"
            to="/friends"
          />
          <ModeCard
            title="Tutorial"
            subtitle="Learn DAX rules"
            visual="tutorial"
            href={getHelpUrl()}
          />
          <ModeCard
            className="mode-grid-custom"
            title="Custom Rules"
            subtitle="House rules & hand sizes"
            visual="custom"
            to="/play"
          />
        </div>

        <p className="text-center text-[10px] text-ivory-dim/60 uppercase tracking-widest mt-4 sm:mt-5">
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

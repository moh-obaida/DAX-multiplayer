import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameMenuShell from "../components/menu/GameMenuShell";
import ModeCard from "../components/menu/ModeCard";
import Modal from "../components/UI/Modal";
import Button from "../components/UI/Button";
import { useRoomStore } from "../store/roomStore";
import { useToastStore } from "../store/toastStore";
import { useAuthStore } from "../store/authStore";
import type { HandSizeOption } from "../config/daxRules";
import { defaultHouseRules } from "../config/daxRules";

const HAND_SIZES: HandSizeOption[] = [7, 10, 14, 21];

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const createRoom = useRoomStore((s) => s.createRoom);
  const joinRoomByCode = useRoomStore((s) => s.joinRoomByCode);
  const addToast = useToastStore((s) => s.add);

  const [joinOpen, setJoinOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [code, setCode] = useState("");

  const [customHand, setCustomHand] = useState<HandSizeOption>(7);
  const [customMax, setCustomMax] = useState(4);
  const [customDax, setCustomDax] = useState(true);
  const [customRules, setCustomRules] = useState(false);

  const playerId = user?.id || "guest";
  const playerName = user?.username || "Guest";

  const handleQuickMatch = () => {
    addToast("Finding a table…", "info");
    setTimeout(() => navigate("/game/demo"), 500);
  };

  const handleCreateRoom = () => {
    const room = createRoom(playerId, playerName, {
      maxPlayers: customMax,
      handSize: customHand,
      daxCallEnabled: customDax,
      customRules,
      houseRules: defaultHouseRules(),
    });
    setCreateOpen(false);
    setCustomOpen(false);
    addToast(`Room ${room.code} created`, "success");
    navigate(`/room/${room.code}`);
  };

  const handleJoin = () => {
    if (code.length !== 6) {
      addToast("Enter a valid 6-digit room code", "error");
      return;
    }
    const ok = joinRoomByCode(code, playerId, playerName);
    if (!ok) {
      addToast("Room not found — check the code", "error");
      return;
    }
    setJoinOpen(false);
    addToast("Joined room!", "success");
    navigate(`/room/${code}`);
  };

  return (
    <GameMenuShell activeNav="home">
      <div className="menu-container flex flex-col justify-center flex-1 py-4 sm:py-6 min-h-0">
        <h2 className="font-display text-xs sm:text-sm uppercase tracking-[0.4em] text-gold text-center mb-4 sm:mb-5">
          Select Mode
        </h2>

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
            onClick={() => setCreateOpen(true)}
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
            to="/help?section=tutorial"
          />
          <ModeCard
            className="mode-grid-custom"
            title="Custom Rules"
            subtitle="House rules & hand sizes"
            visual="custom"
            onClick={() => setCustomOpen(true)}
          />
        </div>

        <p className="text-center text-[10px] text-ivory-dim/60 uppercase tracking-widest mt-4 sm:mt-5">
          Halal · Ad-free · No gambling
        </p>
      </div>

      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Join Private Room">
        <p className="text-sm text-ivory-muted mb-4">Enter the 6-digit code from your host.</p>
        <input
          className="dax-input font-mono text-2xl text-center tracking-[0.4em] mb-4 w-full"
          maxLength={6}
          placeholder="000000"
          value={code}
          autoFocus
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        <Button variant="primary" fullWidth onClick={handleJoin}>Join Table</Button>
      </Modal>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Private Room">
        <p className="text-sm text-ivory-muted mb-4">Host a lobby and invite friends with a 6-digit code.</p>
        <Button variant="primary" fullWidth onClick={handleCreateRoom}>Create Room</Button>
        <button type="button" className="w-full mt-3 text-sm text-gold hover:underline" onClick={() => { setCreateOpen(false); setCustomOpen(true); }}>
          Customize rules first →
        </button>
      </Modal>

      <Modal open={customOpen} onClose={() => setCustomOpen(false)} title="Custom Rules">
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-gold text-xs uppercase tracking-wider block mb-2">Max players ({customMax})</label>
            <input type="range" min={2} max={8} value={customMax} onChange={(e) => setCustomMax(+e.target.value)} className="w-full accent-gold" />
          </div>
          <div>
            <label className="text-gold text-xs uppercase tracking-wider block mb-2">Starting hand</label>
            <div className="grid grid-cols-4 gap-2">
              {HAND_SIZES.map((s) => (
                <button key={s} type="button" onClick={() => setCustomHand(s)}
                  className={`py-2 rounded-lg border font-mono ${customHand === s ? "border-gold bg-gold/15 text-gold" : "border-gold/20 text-ivory-muted"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <label className="flex justify-between items-center">
            <span className="text-ivory-muted">DAX! call enabled</span>
            <input type="checkbox" checked={customDax} onChange={(e) => setCustomDax(e.target.checked)} className="accent-gold w-5 h-5" />
          </label>
          <label className="flex justify-between items-center">
            <span className="text-ivory-muted">Custom house rules</span>
            <input type="checkbox" checked={customRules} onChange={(e) => setCustomRules(e.target.checked)} className="accent-gold w-5 h-5" />
          </label>
        </div>
        <Button variant="primary" fullWidth className="mt-6" onClick={handleCreateRoom}>Create Room with Rules</Button>
      </Modal>
    </GameMenuShell>
  );
}

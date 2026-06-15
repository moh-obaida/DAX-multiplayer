import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GameMenuShell from "../components/menu/GameMenuShell";
import ModeCard from "../components/menu/ModeCard";
import Modal from "../components/UI/Modal";
import Button from "../components/UI/Button";
import { useToastStore } from "../store/toastStore";
import { useAuthStore } from "../store/authStore";
import { createRoom, joinRoom } from "../lib/firebase";
import { copy } from "../lib/copy";
import type { HandSizeOption } from "../config/daxRules";

const HAND_SIZES: HandSizeOption[] = [7, 10, 14, 21];

export default function GameMenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);

  const [joinOpen, setJoinOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [customHand, setCustomHand] = useState<HandSizeOption>(7);
  const [customMax, setCustomMax] = useState(4);
  const [customDax, setCustomDax] = useState(true);
  const [customPlus2, setCustomPlus2] = useState(false);
  const [customPlus4, setCustomPlus4] = useState(false);

  const playerId = user?.id || `guest-${Date.now()}`;
  const playerName = user?.username || "Guest";

  useEffect(() => {
    const join = searchParams.get("join");
    if (join && join.length === 6) {
      setCode(join);
      setJoinOpen(true);
    }
  }, [searchParams]);

  const handleQuickMatch = () => {
    addToast(copy.toast.demoStart, "info");
    navigate("/game/demo");
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const room = await createRoom(playerId, playerName, {
        maxPlayers: customMax,
        handSize: customHand,
        daxCallEnabled: customDax,
        plus2Stack: customPlus2,
        plus4Stack: customPlus4,
      });
      setCreateOpen(false);
      setCustomOpen(false);
      addToast(copy.toast.roomCreated(room.code), "success");
      navigate(`/room/${room.code}`);
    } catch (e) {
      const msg = e instanceof Error && e.message === "RATE_LIMIT"
        ? "Wait 30 seconds before creating another room"
        : copy.toast.createFailed;
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (code.length !== 6) {
      addToast(copy.toast.invalidCode, "error");
      return;
    }
    setLoading(true);
    try {
      const room = await joinRoom(code, playerId, playerName);
      if (!room) {
        addToast(copy.toast.roomNotFound, "error");
        return;
      }
      setJoinOpen(false);
      addToast(copy.toast.roomJoined, "success");
      navigate(`/room/${code}`);
    } catch {
      addToast(copy.toast.joinFailed, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameMenuShell activeNav="play">
      <div className="menu-container flex flex-col justify-center flex-1 py-4 sm:py-6 min-h-0">
        <h2 className="font-display text-xs sm:text-sm uppercase tracking-[0.4em] text-gold text-center mb-4 sm:mb-5">
          Select mode
        </h2>

        <div className="mode-grid w-full">
          <ModeCard
            className="mode-grid-quick"
            title="Quick match"
            subtitle="Jump into a demo table"
            visual="quick"
            primary
            onClick={handleQuickMatch}
          />
          <ModeCard
            title="Private room"
            subtitle="Host friends & rules"
            visual="private"
            onClick={() => setCreateOpen(true)}
          />
          <ModeCard
            title="Join code"
            subtitle="Enter 6-digit room"
            visual="join"
            onClick={() => setJoinOpen(true)}
          />
          <ModeCard
            title="Play with friends"
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
            title="Custom rules"
            subtitle="House rules & hand sizes"
            visual="custom"
            onClick={() => setCustomOpen(true)}
          />
        </div>

        <p className="text-center text-[10px] text-ivory-dim/60 uppercase tracking-widest mt-4 sm:mt-5">
          Halal · Ad-free · No gambling
        </p>
      </div>

      <Modal open={joinOpen} onClose={() => setJoinOpen(false)} title="Join private room">
        <p className="text-sm text-ivory-muted mb-4">Enter the 6-digit code from your host.</p>
        <input
          className="dax-input font-display text-2xl text-center tracking-[0.4em] mb-4 w-full tabular-nums"
          maxLength={6}
          placeholder="000000"
          value={code}
          autoFocus
          inputMode="numeric"
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        <Button variant="primary" fullWidth onClick={handleJoin} disabled={loading}>
          {loading ? "Joining…" : copy.cta.joinRoom}
        </Button>
      </Modal>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create private room">
        <p className="text-sm text-ivory-muted mb-4">Host a lobby and invite friends with a 6-digit code.</p>
        <Button variant="primary" fullWidth onClick={handleCreateRoom} disabled={loading}>
          {loading ? "Creating…" : copy.cta.createRoom}
        </Button>
        <button type="button" className="w-full mt-3 text-sm text-gold hover:underline" onClick={() => { setCreateOpen(false); setCustomOpen(true); }}>
          Customize rules first →
        </button>
      </Modal>

      <Modal open={customOpen} onClose={() => setCustomOpen(false)} title="Custom rules">
        <div className="space-y-4 text-sm">
          <div>
            <label className="text-gold text-xs uppercase tracking-wider block mb-2">Max players ({customMax})</label>
            <input type="range" min={2} max={4} value={customMax} onChange={(e) => setCustomMax(+e.target.value)} className="w-full accent-gold" />
          </div>
          <div>
            <label className="text-gold text-xs uppercase tracking-wider block mb-2">Starting hand</label>
            <div className="grid grid-cols-4 gap-2">
              {HAND_SIZES.map((s) => (
                <button key={s} type="button" onClick={() => setCustomHand(s)}
                  className={`py-2 rounded-lg border font-display tabular-nums ${customHand === s ? "border-gold bg-gold/15 text-gold" : "border-gold/20 text-ivory-muted"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <label className="flex justify-between items-center">
            <span className="text-ivory-muted">UNO call enabled</span>
            <input type="checkbox" checked={customDax} onChange={(e) => setCustomDax(e.target.checked)} className="accent-gold w-5 h-5" />
          </label>
          <label className="flex justify-between items-center">
            <span className="text-ivory-muted">+2 stacking</span>
            <input type="checkbox" checked={customPlus2} onChange={(e) => setCustomPlus2(e.target.checked)} className="accent-gold w-5 h-5" />
          </label>
          <label className="flex justify-between items-center">
            <span className="text-ivory-muted">+4 stacking</span>
            <input type="checkbox" checked={customPlus4} onChange={(e) => setCustomPlus4(e.target.checked)} className="accent-gold w-5 h-5" />
          </label>
        </div>
        <Button variant="primary" fullWidth className="mt-6" onClick={handleCreateRoom} disabled={loading}>
          {loading ? "Creating…" : "Create room with rules"}
        </Button>
      </Modal>
    </GameMenuShell>
  );
}

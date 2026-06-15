import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFriendsStore } from "../../store/friendsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useToastStore } from "../../store/toastStore";
import { copy } from "../../lib/copy";

export default function GameMenuSideRail() {
  const friends = useFriendsStore((s) => s.friends);
  const onlineCount = friends.filter((f) => f.status === "online").length;
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const setSoundVolume = useSettingsStore((s) => s.setSoundVolume);
  const [showJoin, setShowJoin] = useState(false);
  const [code, setCode] = useState("");
  const addToast = useToastStore((s) => s.add);
  const navigate = useNavigate();

  const toggleSound = () => setSoundVolume(soundVolume > 0 ? 0 : 70);

  const submitJoin = () => {
    if (code.length !== 6) {
      addToast(copy.toast.invalidCode, "error");
      return;
    }
    navigate(`/play?join=${code}`);
  };

  return (
    <>
      {/* Left — friends online */}
      <Link
        to="/friends"
        className="absolute left-3 sm:left-5 top-[5.5rem] z-20 game-hud-panel flex items-center gap-2 px-3 py-2 hover:border-gold/40 transition-all"
      >
        <span className="dax-status-online" />
        <span className="text-xs text-ivory">
          <span className="text-gold font-bold font-mono">{onlineCount}</span>
          <span className="text-ivory-dim ml-1 hidden sm:inline">friends online</span>
        </span>
      </Link>

      {/* Right — quick actions */}
      <div className="absolute right-3 sm:right-5 top-[5.5rem] z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowJoin((v) => !v)}
          className="game-hud-panel w-10 h-10 flex items-center justify-center text-sm hover:border-gold/50 transition-all"
          title="Join room code"
        >
          #
        </button>
        <button
          type="button"
          onClick={toggleSound}
          className="game-hud-panel w-10 h-10 flex items-center justify-center text-sm hover:border-gold/50 transition-all"
          title={soundVolume > 0 ? "Mute" : "Unmute"}
        >
          {soundVolume > 0 ? "🔊" : "🔇"}
        </button>
        <Link
          to="/settings"
          className="game-hud-panel w-10 h-10 flex items-center justify-center text-sm hover:border-gold/50 transition-all"
          title="Settings"
        >
          ⚙
        </Link>
      </div>

      {showJoin && (
        <div className="absolute right-3 sm:right-5 top-[11rem] z-30 game-hud-panel p-3 w-48 animate-slide-up">
          <p className="text-[10px] uppercase tracking-widest text-gold mb-2">Room code</p>
          <input
            className="dax-input !py-2 text-center font-mono tracking-widest text-sm mb-2"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />
          <button type="button" onClick={submitJoin} className="dax-btn-primary w-full !py-2 !text-xs">
            Join
          </button>
        </div>
      )}
    </>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import { useRoomStore } from "../../store/roomStore";
import { useToastStore } from "../../store/toastStore";

export default function LobbyActionPanel() {
  const navigate = useNavigate();
  const setJoinCode = useRoomStore((s) => s.setJoinCode);
  const addToast = useToastStore((s) => s.add);
  const [code, setCode] = useState("");

  return (
    <div className="lobby-action-panel dax-panel-glow p-5 sm:p-6 w-full max-w-sm border-gold/30">
      <div className="relative z-[1] space-y-4">
        <Button variant="primary" size="lg" to="/play" fullWidth className="!shadow-gold animate-pulse-gold !text-base !py-4">
          Play Now
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" to="/play" fullWidth className="!text-[11px] !px-2">
            Private Room
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            className="!text-[11px] border border-gold/25 !text-gold"
            onClick={() => document.getElementById("join-code-input")?.focus()}
          >
            Join Code
          </Button>
        </div>

        <div className="pt-2 border-t border-gold/15">
          <label htmlFor="join-code-input" className="text-[10px] uppercase tracking-widest text-ivory-dim block mb-2">
            6-digit room code
          </label>
          <div className="flex gap-2">
            <input
              id="join-code-input"
              className="dax-input !py-2 font-mono text-center tracking-[0.35em] text-sm flex-1"
              maxLength={6}
              placeholder="· · · · · ·"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            <Button
              variant="neon"
              size="sm"
              className="!px-3"
              onClick={() => {
                if (code.length !== 6) {
                  addToast("Enter a 6-digit code", "error");
                  return;
                }
                setJoinCode(code);
                navigate("/play");
              }}
            >
              Go
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

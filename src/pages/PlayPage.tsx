import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import CardPanel from "../components/UI/CardPanel";
import PageShell from "../components/layout/PageShell";
import { useAuthStore } from "../store/authStore";
import { useRoomStore } from "../store/roomStore";
import { useToastStore } from "../store/toastStore";

export default function PlayPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const createRoom = useRoomStore((s) => s.createRoom);
  const joinCode = useRoomStore((s) => s.joinCode);
  const setJoinCode = useRoomStore((s) => s.setJoinCode);
  const joinRoom = useRoomStore((s) => s.joinRoom);
  const addToast = useToastStore((s) => s.add);

  const handleQuickMatch = () => {
    addToast("Searching for opponents...", "info");
    setTimeout(() => navigate("/game/quick-match"), 1200);
  };

  const handleCreateRoom = () => {
    const host = user?.username || "Guest";
    const room = createRoom(user?.id || "guest", host);
    navigate(`/room/${room.code}`);
  };

  const handleJoin = () => {
    if (joinCode.length !== 6) {
      addToast("Enter a valid 6-digit room code", "error");
      return;
    }
    const ok = joinRoom(joinCode, user?.id || "guest", user?.username || "Guest");
    if (ok) navigate(`/room/${joinCode}`);
    else addToast("Room not found — check the code", "error");
  };

  return (
    <PageShell title="Play" subtitle="Quick Match, private rooms, and join-by-code." maxWidth="full">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleQuickMatch()} onClick={handleQuickMatch}>
              <CardPanel glow highlight className="relative overflow-hidden group cursor-pointer h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all" />
                <span className="text-4xl mb-4 block">⚡</span>
                <h3 className="font-display text-xl font-bold text-ivory mb-2">Quick Match</h3>
                <p className="text-sm text-ivory-muted mb-6">Auto-match with players worldwide. Default DAX rules, 7-card hands.</p>
                <Button variant="primary">Find Match</Button>
              </CardPanel>
            </div>

            <div role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()} onClick={handleCreateRoom}>
              <CardPanel glow className="relative overflow-hidden group cursor-pointer h-full">
                <span className="text-4xl mb-4 block">🔐</span>
                <h3 className="font-display text-xl font-bold text-ivory mb-2">Create Private Room</h3>
                <p className="text-sm text-ivory-muted mb-6">Host a lobby, set house rules, invite friends.</p>
                <Button variant="secondary">Create Room</Button>
              </CardPanel>
            </div>
          </div>

          <CardPanel title="Join Room">
            <p className="text-sm text-ivory-muted mb-4">Enter the 6-digit code from your host.</p>
            <div className="flex gap-3">
              <input
                className="dax-input font-mono text-2xl tracking-[0.5em] text-center max-w-[220px]"
                maxLength={6}
                placeholder="000000"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ""))}
              />
              <Button variant="neon" onClick={handleJoin}>Join</Button>
            </div>
          </CardPanel>
        </div>

        <div className="space-y-6">
          <CardPanel title="Live Stats">
            <div className="space-y-4">
              {[["Players Online", "1,284"], ["Active Rooms", "342"], ["Games Today", "8,921"]].map(([l, v]) => (
                <div key={l} className="flex justify-between items-center py-2 border-b border-gold/10 last:border-0">
                  <span className="text-sm text-ivory-muted">{l}</span>
                  <span className="font-display text-gold font-bold">{v}</span>
                </div>
              ))}
            </div>
          </CardPanel>
          <CardPanel title="Default Rules">
            <ul className="text-sm text-ivory-muted space-y-2">
              <li>· 7 cards · 30s turn timer</li>
              <li>· DAX! call enabled</li>
              <li>· Tiered win by table size</li>
              <li>· Forced play on valid cards</li>
            </ul>
          </CardPanel>
        </div>
      </div>
    </PageShell>
  );
}

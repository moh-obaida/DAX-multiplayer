import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import CardPanel from "../components/UI/CardPanel";
import PageShell from "../components/layout/PageShell";
import { useAuthStore } from "../store/authStore";
import { useRoomStore } from "../store/roomStore";
import { useToastStore } from "../store/toastStore";

const MOCK_TABLES = [
  { code: "482910", players: 3, max: 4, hand: 7, status: "Open" },
  { code: "719304", players: 2, max: 6, hand: 10, status: "Open" },
  { code: "305821", players: 4, max: 4, hand: 7, status: "Full" },
];

export default function PlayPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const createRoom = useRoomStore((s) => s.createRoom);
  const joinCode = useRoomStore((s) => s.joinCode);
  const setJoinCode = useRoomStore((s) => s.setJoinCode);
  const joinRoomByCode = useRoomStore((s) => s.joinRoomByCode);
  const addToast = useToastStore((s) => s.add);

  const playerId = user?.id || "guest";
  const playerName = user?.username || "Guest";

  const handleQuickMatch = () => {
    addToast("Searching for opponents…", "info");
    setTimeout(() => navigate("/game/demo"), 800);
  };

  const handleCreateRoom = () => {
    const room = createRoom(playerId, playerName);
    addToast(`Room ${room.code} created`, "success");
    navigate(`/room/${room.code}`);
  };

  const handleJoin = () => {
    if (joinCode.length !== 6) {
      addToast("Enter a valid 6-digit room code", "error");
      return;
    }
    const ok = joinRoomByCode(joinCode, playerId, playerName);
    if (!ok) {
      addToast("Room not found — check the code", "error");
      return;
    }
    navigate(`/room/${joinCode}`);
  };

  const joinMockTable = (code: string) => {
    setJoinCode(code);
    const ok = joinRoomByCode(code, playerId, playerName);
    if (ok) navigate(`/room/${code}`);
    else addToast("Table unavailable — create your own room", "info");
  };

  return (
    <PageShell title="Game Lobby" subtitle="Find a table, host a room, or join with a code." maxWidth="full">
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div role="button" tabIndex={0} className="cursor-pointer" onKeyDown={(e) => e.key === "Enter" && handleQuickMatch()} onClick={handleQuickMatch}>
              <CardPanel glow highlight className="relative overflow-hidden group h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all" />
                <p className="text-gold text-[10px] uppercase tracking-widest mb-2">Fastest way in</p>
                <h3 className="font-display text-xl font-bold text-ivory mb-2">Quick Match</h3>
                <p className="text-sm text-ivory-muted mb-4">Auto-match with players. Default DAX rules, 7-card hands.</p>
                <Button variant="primary">Find Match</Button>
              </CardPanel>
            </div>

            <div role="button" tabIndex={0} className="cursor-pointer" onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()} onClick={handleCreateRoom}>
              <CardPanel glow className="h-full">
                <p className="text-gold text-[10px] uppercase tracking-widest mb-2">Host</p>
                <h3 className="font-display text-xl font-bold text-ivory mb-2">Create Private Room</h3>
                <p className="text-sm text-ivory-muted mb-4">Get a 6-digit code, set rules, invite friends.</p>
                <Button variant="secondary">Create Room</Button>
              </CardPanel>
            </div>
          </div>

          <CardPanel title="Join by Code">
            <p className="text-sm text-ivory-muted mb-4">Enter the 6-digit code from your host.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="dax-input font-mono text-2xl tracking-[0.4em] text-center sm:max-w-[220px]"
                maxLength={6}
                placeholder="000000"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ""))}
              />
              <Button variant="neon" onClick={handleJoin}>Join Room</Button>
            </div>
          </CardPanel>

          <CardPanel title="Available Tables">
            <div className="space-y-2">
              {MOCK_TABLES.map((t) => (
                <div key={t.code} className="flex items-center justify-between p-3 rounded-lg bg-emerald-dark/50 border border-gold/10">
                  <div>
                    <span className="font-mono text-gold font-bold">{t.code}</span>
                    <span className="text-xs text-ivory-dim ml-3">{t.players}/{t.max} · {t.hand} cards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs uppercase ${t.status === "Open" ? "text-green" : "text-ivory-dim"}`}>{t.status}</span>
                    {t.status === "Open" && (
                      <Button variant="ghost" size="sm" onClick={() => joinMockTable(t.code)}>Join</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-ivory-dim mt-3">Mock tables for demo — create a room to play with bots.</p>
          </CardPanel>
        </div>

        <div className="space-y-6">
          <CardPanel title="Live Stats">
            <div className="space-y-3">
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
            <Button variant="ghost" size="sm" className="mt-4" to="/help">Full rules →</Button>
          </CardPanel>
        </div>
      </div>
    </PageShell>
  );
}

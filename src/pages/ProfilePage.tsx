import Button from "../components/UI/Button";
import CardPanel from "../components/UI/CardPanel";
import PageShell from "../components/layout/PageShell";
import { useAuthStore } from "../store/authStore";

const AVATARS = ["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5", "avatar-6"];
const ACHIEVEMENTS = [
  { id: "a1", name: "First Blood", desc: "Win your first match", unlocked: true },
  { id: "a2", name: "DAX Master", desc: "Call DAX! 50 times", unlocked: true },
  { id: "a3", name: "Table Titan", desc: "Win an 8-player game", unlocked: false },
  { id: "a4", name: "Streak King", desc: "10 win streak", unlocked: false },
];
const RECENT = [
  { id: "g1", vs: ["NadiaK", "OmarPlays"], result: "win" as const, ago: "2h ago" },
  { id: "g2", vs: ["ZaraCards"], result: "loss" as const, ago: "1d ago" },
  { id: "g3", vs: ["KhalidDAX", "LaylaM", "YusufG"], result: "win" as const, ago: "2d ago" },
];

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const stats = user?.stats ?? { totalGames: 0, wins: 0, losses: 0, currentStreak: 0 };
  const winRate = stats.totalGames ? Math.round((stats.wins / stats.totalGames) * 100) : 0;

  if (!user) {
    return (
      <PageShell title="Profile">
        <CardPanel><p className="text-ivory-muted mb-4">Sign in to view your profile and stats.</p><Button to="/login" variant="primary">Log In</Button></CardPanel>
      </PageShell>
    );
  }

  return (
    <PageShell maxWidth="full">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <CardPanel glow highlight>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gold-shine flex items-center justify-center font-display text-4xl font-black text-emerald-dark mb-4 shadow-gold">
                {user.username[0]?.toUpperCase()}
              </div>
              <h1 className="font-display text-2xl font-bold text-ivory">{user.username}</h1>
              <p className="text-ivory-dim text-sm">{user.email}</p>
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-gold mb-3">Avatar</p>
              <div className="grid grid-cols-3 gap-2">
                {AVATARS.map((a) => (
                  <button key={a} type="button" className={`aspect-square rounded-lg border-2 flex items-center justify-center text-lg font-bold ${user.avatarId === a ? "border-gold bg-gold/15 text-gold" : "border-gold/20 text-ivory-dim hover:border-gold/40"}`}>
                    {a.split("-")[1]}
                  </button>
                ))}
              </div>
            </div>
          </CardPanel>
          <Button variant="secondary" fullWidth to="/settings">Account Settings</Button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[["Wins", stats.wins], ["Losses", stats.losses], ["Win Rate", `${winRate}%`], ["Streak", stats.currentStreak]].map(([l, v]) => (
              <CardPanel key={l as string} className="text-center !p-4">
                <div className="dax-stat-value">{v}</div>
                <div className="text-xs text-ivory-dim uppercase tracking-wider mt-1">{l}</div>
              </CardPanel>
            ))}
          </div>

          <CardPanel title="Achievements">
            <div className="grid sm:grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((a) => (
                <div key={a.id} className={`p-3 rounded-lg border ${a.unlocked ? "border-gold/30 bg-gold/5" : "border-gold/10 opacity-50"}`}>
                  <p className="font-display text-sm text-ivory">{a.name}</p>
                  <p className="text-xs text-ivory-dim">{a.desc}</p>
                </div>
              ))}
            </div>
          </CardPanel>

          <CardPanel title="Recent Games">
            <div className="space-y-2">
              {RECENT.map((g) => (
                <div key={g.id} className="flex items-center justify-between py-2 border-b border-gold/10 last:border-0 text-sm">
                  <span className="text-ivory-muted">vs {g.vs.join(", ")}</span>
                  <div className="flex items-center gap-3">
                    <span className={g.result === "win" ? "text-green" : "text-red"}>{g.result.toUpperCase()}</span>
                    <span className="text-ivory-dim font-mono text-xs">{g.ago}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardPanel>
        </div>
      </div>
    </PageShell>
  );
}

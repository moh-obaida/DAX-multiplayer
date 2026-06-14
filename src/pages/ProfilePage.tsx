import { useState } from "react";
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

const GUEST_STATS = { totalGames: 12, wins: 7, losses: 5, currentStreak: 2 };

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.username ?? "");

  const stats = user?.stats ?? GUEST_STATS;
  const winRate = stats.totalGames ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
  const isGuest = !user;

  const saveUsername = () => {
    if (user && nameDraft.trim().length >= 2) {
      updateUser({ username: nameDraft.trim(), displayName: nameDraft.trim() });
    }
    setEditingName(false);
  };

  return (
    <PageShell maxWidth="full">
      {isGuest && (
        <div className="mb-6 p-4 rounded-xl border border-gold/30 bg-gold/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-gold text-sm uppercase tracking-wider">Guest Profile Preview</p>
            <p className="text-sm text-ivory-muted mt-1">Sign in to save stats, avatars, and achievements.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" to="/login">Log In</Button>
            <Button variant="secondary" to="/register">Create Account</Button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <CardPanel glow highlight={!isGuest}>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gold-shine flex items-center justify-center font-display text-4xl font-black text-emerald-dark mb-4 shadow-gold">
                {(user?.username ?? "G")[0]?.toUpperCase()}
              </div>
              {editingName && user ? (
                <div className="flex gap-2 justify-center mb-2">
                  <input className="dax-input text-center max-w-[160px]" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} maxLength={10} />
                  <Button variant="primary" size="sm" onClick={saveUsername}>Save</Button>
                </div>
              ) : (
                <h1 className="font-display text-2xl font-bold text-ivory">{user?.username ?? "Guest Player"}</h1>
              )}
              <p className="text-green text-xs uppercase tracking-wider mt-1">Online</p>
              {user?.email && <p className="text-ivory-dim text-sm mt-1">{user.email}</p>}
            </div>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-gold mb-3">Avatar</p>
              <div className="grid grid-cols-3 gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    disabled={isGuest}
                    onClick={() => user && updateUser({ avatarId: a })}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-lg font-bold ${(user?.avatarId ?? "avatar-1") === a ? "border-gold bg-gold/15 text-gold" : "border-gold/20 text-ivory-dim hover:border-gold/40"} ${isGuest ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {a.split("-")[1]}
                  </button>
                ))}
              </div>
            </div>
            {user && (
              <Button variant="ghost" size="sm" fullWidth className="mt-4" onClick={() => { setNameDraft(user.username); setEditingName(true); }}>
                Edit Username
              </Button>
            )}
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

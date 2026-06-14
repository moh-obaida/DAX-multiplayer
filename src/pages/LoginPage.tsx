import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import CardPanel from "../components/UI/CardPanel";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((s) => s.setUser);
  const addToast = useToastStore((s) => s.add);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: "user-1",
      email,
      displayName: "Player",
      username: email.split("@")[0]?.slice(0, 10) || "Player",
      avatarId: "avatar-1",
      stats: { totalGames: 42, wins: 28, losses: 14, currentStreak: 3 },
    });
    addToast("Welcome back!", "success");
    navigate("/play");
  };

  return (
    <div className="min-h-[calc(100vh-4.25rem)] flex items-center justify-center px-4 py-12 game-grid-bg">
      <CardPanel glow className="w-full max-w-md relative">
        <span className="dax-corner-accent tl" /><span className="dax-corner-accent tr" />
        <span className="dax-corner-accent bl" /><span className="dax-corner-accent br" />
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-ivory">Sign In</h1>
          <p className="text-ivory-muted text-sm mt-2">Enter the arena</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-gold mb-1.5 block">Email</label>
            <input type="email" required className="dax-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-gold mb-1.5 block">Password</label>
            <input type="password" required minLength={8} className="dax-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" variant="primary" fullWidth>Log In</Button>
        </form>
        <div className="relative my-6">
          <div className="dax-gold-line" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-board px-3 text-xs text-ivory-dim">OR</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Google", "Apple", "Facebook"].map((p) => (
            <button key={p} type="button" className="dax-input text-xs py-2.5 hover:border-gold/40 transition-colors cursor-not-allowed opacity-60" disabled title="Coming soon">
              {p}
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-ivory-muted mt-6">
          No account? <Link to="/register" className="text-gold hover:underline">Register</Link>
        </p>
      </CardPanel>
    </div>
  );
}

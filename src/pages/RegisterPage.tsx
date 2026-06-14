import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import CardPanel from "../components/UI/CardPanel";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";

const USERNAME_RE = /^[a-zA-Z0-9]{2,10}$/;
const PASSWORD_RE = /^(?=.*\d).{8,}$/;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setUser = useAuthStore((s) => s.setUser);
  const addToast = useToastStore((s) => s.add);
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!USERNAME_RE.test(username)) e.username = "2–10 alphanumeric characters only";
    if (!PASSWORD_RE.test(password)) e.password = "Minimum 8 characters with at least 1 number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setUser({
      id: `user-${Date.now()}`,
      email,
      displayName: username,
      username,
      avatarId: "avatar-1",
      stats: { totalGames: 0, wins: 0, losses: 0, currentStreak: 0 },
    });
    addToast("Account created — good luck at the table!", "success");
    navigate("/play");
  };

  return (
    <div className="min-h-[calc(100vh-4.25rem)] flex items-center justify-center px-4 py-12 game-grid-bg">
      <CardPanel glow className="w-full max-w-md relative">
        <span className="dax-corner-accent tl" /><span className="dax-corner-accent tr" />
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-ivory">Create Account</h1>
          <p className="text-ivory-muted text-sm mt-2">Join the DAX multiplayer network</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-gold mb-1.5 block">Email</label>
            <input type="email" required className="dax-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-gold mb-1.5 block">Username</label>
            <input type="text" required className="dax-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="2–10 alphanumeric" />
            {errors.username && <p className="text-red text-xs mt-1">{errors.username}</p>}
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-gold mb-1.5 block">Password</label>
            <input type="password" required className="dax-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ chars, 1 number" />
            {errors.password && <p className="text-red text-xs mt-1">{errors.password}</p>}
          </div>
          <Button type="submit" variant="primary" fullWidth>Create Account</Button>
        </form>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {["Google", "Apple", "Facebook"].map((p) => (
            <button key={p} type="button" className="dax-input text-xs py-2.5 opacity-60 cursor-not-allowed" disabled>{p}</button>
          ))}
        </div>
        <p className="text-center text-sm text-ivory-muted mt-6">
          Have an account? <Link to="/login" className="text-gold hover:underline">Log in</Link>
        </p>
      </CardPanel>
    </div>
  );
}

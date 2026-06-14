import Button from "../components/UI/Button";
import CardPanel from "../components/UI/CardPanel";
import PageShell from "../components/layout/PageShell";
import { useSettingsStore } from "../store/settingsStore";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const settings = useSettingsStore();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const navigate = useNavigate();

  const handleReset = () => {
    settings.resetPreferences();
    addToast("Preferences reset to defaults", "success");
  };

  const handleSignOut = () => {
    logout();
    addToast("Signed out", "info");
    navigate("/");
  };

  return (
    <PageShell title="Settings" subtitle="Audio, accessibility, and session preferences." maxWidth="lg">
      <div className="space-y-6">
        <CardPanel title="Display">
          <label className="flex items-center justify-between py-3 border-b border-gold/10">
            <div><p className="text-ivory">Dark mode</p><p className="text-xs text-ivory-dim">Emerald table theme (recommended)</p></div>
            <input type="checkbox" checked={settings.darkMode} onChange={(e) => settings.setDarkMode(e.target.checked)} className="accent-gold w-5 h-5" />
          </label>
          <label className="flex items-center justify-between py-3 border-b border-gold/10">
            <div><p className="text-ivory">Large font</p><p className="text-xs text-ivory-dim">Increase UI text size</p></div>
            <input type="checkbox" checked={settings.fontSize === "large"} onChange={(e) => settings.setFontSize(e.target.checked ? "large" : "normal")} className="accent-gold w-5 h-5" />
          </label>
          <label className="flex items-center justify-between py-3">
            <div><p className="text-ivory">Colorblind mode</p><p className="text-xs text-ivory-dim">Patterns on card colors</p></div>
            <input type="checkbox" checked={settings.colorblindMode} onChange={(e) => settings.setColorblindMode(e.target.checked)} className="accent-gold w-5 h-5" />
          </label>
        </CardPanel>

        <CardPanel title="Audio">
          <label className="block">
            <span className="text-sm text-ivory-muted">Sound volume — {settings.soundVolume}%</span>
            <input type="range" min={0} max={100} value={settings.soundVolume} onChange={(e) => settings.setSoundVolume(+e.target.value)} className="w-full mt-2 accent-gold" />
          </label>
        </CardPanel>

        <CardPanel title="Session">
          <label className="flex items-center justify-between py-3">
            <div><p className="text-ivory">Remember me</p><p className="text-xs text-ivory-dim">Stay signed in on this device</p></div>
            <input type="checkbox" checked={settings.rememberMe} onChange={(e) => settings.setRememberMe(e.target.checked)} className="accent-gold w-5 h-5" />
          </label>
        </CardPanel>

        <div className="flex flex-wrap gap-4">
          <Button variant="primary" onClick={() => addToast("Settings saved", "success")}>Save</Button>
          <Button variant="secondary" onClick={handleReset}>Reset Preferences</Button>
          {user && <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>}
        </div>
      </div>
    </PageShell>
  );
}

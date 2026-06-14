import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import { useAuthStore } from "./store/authStore";
import { useSettingsStore } from "./store/settingsStore";

export default function MainApp() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);

  useEffect(() => {
    hydrateSettings();
    hydrateAuth();
  }, [hydrateAuth, hydrateSettings]);

  return <AppRouter />;
}

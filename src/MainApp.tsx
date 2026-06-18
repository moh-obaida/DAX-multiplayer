import { useEffect } from "react";
import * as Sentry from "@sentry/react";
import AppRouter from "./router/AppRouter";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import { useAuthStore } from "./store/authStore";
import { useSettingsStore } from "./store/settingsStore";
import { ensureAuth, isFirebaseConfigured } from "./lib/firebase";
import { getStableGuestId } from "./lib/playerId";

export default function MainApp() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const setUser = useAuthStore((s) => s.setUser);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    hydrateSettings();
    hydrateAuth();
  }, [hydrateAuth, hydrateSettings]);

  useEffect(() => {
    void (async () => {
      if (isFirebaseConfigured) {
        const fbUser = await ensureAuth();
        if (fbUser) {
          Sentry.setUser({ id: fbUser.uid });
          if (user && user.id !== fbUser.uid) {
            setUser({ ...user, id: fbUser.uid });
          }
        }
      } else if (user) {
        Sentry.setUser({ id: user.id });
      } else {
        Sentry.setUser({ id: getStableGuestId() });
      }
    })();
  }, [user, setUser]);

  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
}

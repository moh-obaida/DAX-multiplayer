/** Internal help route — always safe for in-app navigation */
export function getHelpPath(section = ""): string {
  const base = "/help";
  if (!section) return base;
  return `${base}?section=${encodeURIComponent(section)}`;
}

/** External help URL only when VITE_HELP_URL is configured; otherwise internal /help */
export function getHelpUrl(path = ""): string {
  const external = import.meta.env.VITE_HELP_URL;
  if (external) {
    return `${String(external).replace(/\/$/, "")}${path}`;
  }
  return getHelpPath(path.replace(/^\//, ""));
}

export function isExternalHelpUrl(): boolean {
  return Boolean(import.meta.env.VITE_HELP_URL);
}

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/\.$/, "");
}

/** Help subdomain only when explicitly enabled via env (never blind host.startsWith). */
export function isHelpSubdomain(): boolean {
  const enabled = import.meta.env.VITE_ENABLE_HELP_SUBDOMAIN === "true";
  if (!enabled) return false;

  const configured = import.meta.env.VITE_HELP_HOST?.trim();
  const host = normalizeHost(window.location.hostname);

  if (configured) {
    return host === normalizeHost(configured);
  }

  // Dev-only fallback when env flag is on but host not set
  return import.meta.env.DEV && host === "help.localhost";
}

export function getAppDomain(): string {
  return import.meta.env.VITE_APP_DOMAIN || "localhost";
}

export function getMainAppUrl(): string {
  if (import.meta.env.VITE_APP_URL) return import.meta.env.VITE_APP_URL;
  const port = window.location.port || (import.meta.env.DEV ? "5173" : "");
  const protocol = window.location.protocol;
  return `${protocol}//${getAppDomain()}${port ? `:${port}` : ""}`;
}

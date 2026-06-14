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

export function isHelpSubdomain(): boolean {
  const host = window.location.hostname;
  return host === "help.localhost" || host.startsWith("help.");
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

const DEFAULT_PORT = import.meta.env.DEV ? "5173" : "";

export function isHelpSubdomain(): boolean {
  const host = window.location.hostname;
  return host === "help.localhost" || host.startsWith("help.");
}

export function getAppDomain(): string {
  return import.meta.env.VITE_APP_DOMAIN || "localhost";
}

export function getHelpDomain(): string {
  return import.meta.env.VITE_HELP_DOMAIN || "help.localhost";
}

export function getMainAppUrl(): string {
  if (import.meta.env.VITE_APP_URL) return import.meta.env.VITE_APP_URL;
  const port = window.location.port || DEFAULT_PORT;
  const protocol = window.location.protocol;
  return `${protocol}//${getAppDomain()}${port ? `:${port}` : ""}`;
}

export function getHelpUrl(path = ""): string {
  if (import.meta.env.VITE_HELP_URL) {
    return `${import.meta.env.VITE_HELP_URL.replace(/\/$/, "")}${path}`;
  }
  const port = window.location.port || DEFAULT_PORT;
  const protocol = window.location.protocol;
  return `${protocol}//${getHelpDomain()}${port ? `:${port}` : ""}${path}`;
}

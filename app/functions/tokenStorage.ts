const AT_KEY = "at";
const RT_KEY = "rt";
const AT_EXP_KEY = "at_exp";

const EXPIRY_SKEW_MS = 30_000;

export function readAccessToken(): string | null {
  return localStorage.getItem(AT_KEY);
}

export function readRefreshToken(): string | null {
  return localStorage.getItem(RT_KEY);
}

export function readAccessTokenExpiry(): number | null {
  const value = localStorage.getItem(AT_EXP_KEY);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(AT_KEY, accessToken);
  localStorage.setItem(RT_KEY, refreshToken);

  const expiry = decodeJwtExpiryMs(accessToken);
  if (expiry !== null) {
    localStorage.setItem(AT_EXP_KEY, String(expiry));
  } else {
    localStorage.removeItem(AT_EXP_KEY);
  }
}

export function clearTokens(): void {
  localStorage.removeItem(AT_KEY);
  localStorage.removeItem(RT_KEY);
  localStorage.removeItem(AT_EXP_KEY);
}

export function isAccessTokenExpired(): boolean {
  const expiry = readAccessTokenExpiry();
  if (expiry === null) return true;
  return Date.now() >= expiry - EXPIRY_SKEW_MS;
}

function decodeJwtExpiryMs(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    if (typeof payload.exp !== "number") return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

export function getGoogleClientId(): string | null {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (typeof clientId !== "string") {
    return null;
  }

  const trimmed = clientId.trim();

  return trimmed.length === 0 ? null : trimmed;
}

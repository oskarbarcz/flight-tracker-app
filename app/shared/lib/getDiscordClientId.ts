export function getDiscordClientId(): string | null {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;

  if (typeof clientId !== "string") {
    return null;
  }

  const trimmed = clientId.trim();

  return trimmed.length === 0 ? null : trimmed;
}

export function getCartoApiKey(): string | null {
  const apiKey = import.meta.env.VITE_CARTO_API_KEY;

  if (typeof apiKey !== "string") {
    return null;
  }

  const trimmed = apiKey.trim();

  return trimmed.length === 0 ? null : trimmed;
}

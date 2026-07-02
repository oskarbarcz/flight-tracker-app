export function formatLatitude(lat: number): string {
  const dir = lat >= 0 ? "N" : "S";
  return `${Math.abs(lat).toFixed(4)}°${dir}`;
}

export function formatLongitude(lon: number): string {
  const dir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lon).toFixed(4)}°${dir}`;
}

export function formatCoordinates(lat: number, lon: number): string {
  return `${formatLatitude(lat)} · ${formatLongitude(lon)}`;
}

export function getUtcOffset(timezone: string, date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((p) => p.type === "timeZoneName");
    return (offsetPart?.value ?? "").replace(/^GMT/, "UTC");
  } catch {
    return "";
  }
}

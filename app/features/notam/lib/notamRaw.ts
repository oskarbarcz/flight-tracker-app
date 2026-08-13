export function formatRawNotam(raw: string): string {
  return raw
    .split("\n")
    .map((line) => line.trimEnd().replace(/^\s+/, ""))
    .join("\n")
    .trim();
}

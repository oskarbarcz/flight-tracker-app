export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

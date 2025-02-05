export function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function getTimeDifferenceInMinutes(a: Date, b: Date): number {
  const diffInMs = b.getTime() - a.getTime();
  return Math.floor(diffInMs / (1000 * 60));
}

export function getTimeDifferenceInHours(a: Date, b: Date): string {
  const diffInMs = b.getTime() - a.getTime();
  const totalMinutes = Math.floor(diffInMs / (1000 * 60));
  const sign = totalMinutes < 0 ? "-" : "";
  const absMinutes = Math.abs(totalMinutes);
  const hours = String(Math.floor(absMinutes / 60)).padStart(2, "0");
  const minutes = String(absMinutes % 60).padStart(2, "0");

  return `${sign}${hours}:${minutes}`;
}

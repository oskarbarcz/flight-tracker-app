export function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function formatDateToLocal(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function getTimeDifferenceInMinutes(a: Date, b: Date): number {
  console.log(a, b);
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

export function formatTimeInterval(seconds: number) {
  const sign = seconds < 0 ? "-" : "";
  const absSeconds = Math.abs(seconds);

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;

  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function timeDiff(a: Date, b: Date): number {
  const diff = b.getTime() - a.getTime();
  return Math.round(diff / 1000);
}

export function secondsToNow(time: Date): number {
  return timeDiff(new Date(), time);
}

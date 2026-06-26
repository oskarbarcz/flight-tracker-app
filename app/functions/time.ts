export function padZero(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}

export function durationMinutes(start: Date, end: Date): number {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60_000));
}

export function formatDuration(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${padZero(minutes % 60)}m`;
}

export function formatDate(date: Date): string {
  const day = padZero(date.getUTCDate());
  const month = padZero(date.getUTCMonth() + 1);
  const year = date.getUTCFullYear();
  const hours = padZero(date.getUTCHours());
  const minutes = padZero(date.getUTCMinutes());

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function formatDateToLocal(date: Date): string {
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getUTCFullYear();
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

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
  const hours = padZero(Math.floor(absMinutes / 60));
  const minutes = padZero(absMinutes % 60);

  return `${sign}${hours}:${minutes}`;
}

export function formatTimeInterval(seconds: number) {
  const sign = seconds < 0 ? "-" : "";
  const absSeconds = Math.abs(seconds);

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;

  return `${sign}${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}`;
}

export function timeDiff(a: Date, b: Date): number {
  const diff = b.getTime() - a.getTime();
  return Math.round(diff / 1000);
}

export function dateDiffToReadable(a: Date, b: Date): string {
  const diffMs = b.getTime() - a.getTime();
  const sign = diffMs < 0 ? "-" : "";
  const absMs = Math.abs(diffMs);

  const hours = Math.floor(absMs / (1000 * 60 * 60));
  const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${sign}${hours}hr ${minutes}m`;
}

export function dateDiffToProgress(a: Date, b: Date, now: Date = new Date()): number {
  const totalMs = b.getTime() - a.getTime();

  if (totalMs <= 0) return 5;

  const elapsedMs = now.getTime() - a.getTime();
  const ratio = elapsedMs / totalMs;

  return Math.max(5, Math.min(95, ratio * 100));
}

export function secondsToNow(time: Date): number {
  return timeDiff(new Date(), time);
}

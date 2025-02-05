export function formatDate(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function formatDateKeepLocal(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

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

export function getHourFromDate(date: string | undefined): string {
  if (!date) {
    return "";
  }

  const utcHours = String(new Date(date).getUTCHours()).padStart(2, "0");
  const utcMinutes = String(new Date(date).getUTCMinutes()).padStart(2, "0");

  return `${utcHours}:${utcMinutes}`;
}

export function utcFromAny(date: string): Date {
  const localDate = new Date(date);

  return new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds(),
      localDate.getMilliseconds(),
    ),
  );
}

export function normalizeFilter(filter: string): string {
  return filter.trim().toLowerCase();
}

export function matchesFilter(query: string, ...values: (string | null | undefined)[]): boolean {
  if (query === "") return true;
  return values.some((value) => value?.toLowerCase().includes(query));
}

export function matchesKeywords(keywords: string[], query: string): boolean {
  return keywords.some((keyword) => keyword.toLowerCase().includes(query));
}

export function keywordRank(keywords: string[], query: string): number {
  const normalized = keywords.map((keyword) => keyword.toLowerCase());
  if (normalized.some((keyword) => keyword === query)) {
    return 0;
  }
  if (normalized.some((keyword) => keyword.startsWith(query))) {
    return 1;
  }
  return 2;
}

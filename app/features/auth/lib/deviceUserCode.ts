const groupLength = 4;

export function normalizeUserCode(input: string | null): string | null {
  if (input === null) {
    return null;
  }

  const characters = input.replace(/[^0-9a-z]/gi, "").toUpperCase();

  return characters === "" ? null : characters;
}

export function formatUserCode(normalized: string): string {
  const groups = normalized.match(new RegExp(`.{1,${groupLength}}`, "g")) ?? [normalized];

  return groups.join("-");
}

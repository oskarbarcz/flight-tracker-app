export function resolvePositionDesignator(
  designator: string,
  compartment: number | null,
  published: ReadonlySet<string>,
): string | null {
  if (published.has(designator)) {
    return designator;
  }

  if (compartment === null) {
    return null;
  }

  const prefix = String(compartment);

  if (designator.startsWith(prefix)) {
    const stripped = designator.slice(prefix.length);
    if (published.has(stripped)) {
      return stripped;
    }
  }

  const prefixed = `${prefix}${designator}`;
  return published.has(prefixed) ? prefixed : null;
}

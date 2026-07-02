export function buildEnumLookup<T extends string>(options: { value: T | ""; label: string }[]): (value: T) => string {
  const map = new Map(options.map((o) => [o.value as string, o.label]));
  return (value: T) => map.get(value) ?? value;
}

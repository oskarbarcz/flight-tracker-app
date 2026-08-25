export function normaliseDesignator(designator: string, compartment: number): string {
  const prefix = String(compartment);
  return designator.startsWith(prefix) ? designator : `${prefix}${designator}`;
}

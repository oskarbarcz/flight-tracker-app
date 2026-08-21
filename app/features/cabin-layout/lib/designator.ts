const DESIGNATOR = /^(\d+)([A-Z]+)$/;

export type SeatDesignator = {
  row: number;
  letter: string;
};

export function parseDesignator(designator: string): SeatDesignator | null {
  const match = DESIGNATOR.exec(designator);
  if (match === null) {
    return null;
  }
  return { row: Number(match[1]), letter: match[2] };
}

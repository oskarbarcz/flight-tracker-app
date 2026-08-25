const UNPROCESSABLE = 422;
const CAPACITY_MESSAGE = /cannot seat (\d+) passengers in a cabin of (\d+) seats/i;

export type CapacityRefusal = {
  passengers: number;
  seats: number;
};

export function capacityRefusal(reason: unknown): CapacityRefusal | null {
  const failure = reason as { statusCode?: number; message?: unknown };

  if (failure?.statusCode !== undefined && failure.statusCode !== UNPROCESSABLE) {
    return null;
  }

  if (typeof failure?.message !== "string") {
    return null;
  }

  const match = CAPACITY_MESSAGE.exec(failure.message);

  if (match === null) {
    return null;
  }

  return { passengers: Number(match[1]), seats: Number(match[2]) };
}

export function describeCapacityRefusal(refusal: CapacityRefusal, layoutId: string | null): string {
  const cabin = layoutId === null ? "the cabin" : `${layoutId}`;

  return `${refusal.passengers} passengers will not fit: ${cabin} holds ${refusal.seats} seats. Lower the passenger figure on the loadsheet, or assign a cabin layout that seats them.`;
}

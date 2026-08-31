const UNPROCESSABLE = 422;
const SEATING_REFUSAL = /cannot seat (\d+) passengers in a cabin of (\d+) seats/i;
const PAYLOAD_REFUSAL = /payload of (\d+) kg cannot carry (\d+) kg/i;

function refusalMessage(reason: unknown): string | null {
  const failure = reason as { statusCode?: number; message?: unknown };

  if (failure?.statusCode !== undefined && failure.statusCode !== UNPROCESSABLE) {
    return null;
  }

  return typeof failure?.message === "string" ? failure.message : null;
}

function tons(kilograms: number): string {
  return `${kilograms / 1000} t`;
}

export function describeLoadsheetRefusal(reason: unknown, layoutId: string | null): string | null {
  const message = refusalMessage(reason);

  if (message === null) {
    return null;
  }

  const seating = SEATING_REFUSAL.exec(message);

  if (seating !== null) {
    const cabin = layoutId ?? "the cabin";

    return `${seating[1]} passengers will not fit: ${cabin} holds ${seating[2]} seats. Lower the passenger figure on the loadsheet, or assign a cabin layout that seats them.`;
  }

  const payload = PAYLOAD_REFUSAL.exec(message);

  if (payload !== null) {
    const declared = Number(payload[1]);
    const required = Number(payload[2]);

    return `Payload of ${tons(declared)} is ${tons(required - declared)} short: cargo and passengers come to ${tons(required)}. Raise the payload, or lower cargo or passengers.`;
  }

  return null;
}

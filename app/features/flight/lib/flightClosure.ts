import type { DelayRequest } from "~/features/delay";
import type { Emergency } from "~/features/emergency";

export type ClosureBlock = "emergency" | "delay";

export function closureBlock(
  activeEmergency: Emergency | null,
  delayRequest: DelayRequest | null,
): ClosureBlock | null {
  if (activeEmergency !== null) {
    return "emergency";
  }

  return delayRequest !== null && !delayRequest.isSettled ? "delay" : null;
}

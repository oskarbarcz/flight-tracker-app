import { unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";

export type DeviceSignInStep = "lookup" | "approve" | "decline";

export type DeviceSignInFailure = { kind: "gone" } | { kind: "failed"; message: string };

const temporaryFailureMessages: Record<DeviceSignInStep, string> = {
  lookup: "Couldn’t check this code right now. Try again in a moment.",
  approve: "Couldn’t approve the sign-in right now. Try again in a moment.",
  decline: "Couldn’t decline the sign-in right now. Try again in a moment.",
};

export function describeDeviceSignInFailure(reason: unknown, step: DeviceSignInStep): DeviceSignInFailure {
  const statusCode = (reason as { statusCode?: number } | null)?.statusCode;

  if (statusCode === 404 || statusCode === 400) {
    return { kind: "gone" };
  }

  if (statusCode === undefined) {
    return { kind: "failed", message: unreachableServiceMessage };
  }

  return { kind: "failed", message: temporaryFailureMessages[step] };
}

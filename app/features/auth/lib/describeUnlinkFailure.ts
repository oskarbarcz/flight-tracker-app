import { isServerFailure, unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";

export type UnlinkProvider = "Google" | "Discord";

export type UnlinkFailure =
  | { kind: "password"; message: string }
  | { kind: "blocked"; message: string }
  | { kind: "absent" }
  | { kind: "section"; message: string };

const wrongPasswordMessage = "That is not your current password.";

function noPasswordMessage(provider: UnlinkProvider): string {
  return `Set a password before disconnecting ${provider}, otherwise you would be left with no way to sign in.`;
}

function temporaryFailureMessage(provider: UnlinkProvider): string {
  return `Couldn't disconnect your ${provider} account right now. Try again in a moment.`;
}

function rejectedMessage(provider: UnlinkProvider): string {
  return `Your ${provider} account couldn't be disconnected. Try again.`;
}

type FailureReason = {
  statusCode?: number;
  message?: unknown;
};

function readReason(reason: unknown): FailureReason {
  return (reason ?? {}) as FailureReason;
}

function reports(failure: FailureReason, expected: string): boolean {
  const message = failure.message;

  return typeof message === "string" && message.trim().toLowerCase().includes(expected);
}

export function describeUnlinkFailure(reason: unknown, provider: UnlinkProvider): UnlinkFailure {
  const failure = readReason(reason);
  const name = provider.toLowerCase();

  if (reports(failure, `set a password before unlinking your ${name} account`)) {
    return { kind: "blocked", message: noPasswordMessage(provider) };
  }

  if (reports(failure, `has no linked ${name} account`)) {
    return { kind: "absent" };
  }

  if (failure.statusCode === 401) {
    return { kind: "password", message: wrongPasswordMessage };
  }

  if (failure.statusCode === undefined) {
    return { kind: "section", message: unreachableServiceMessage };
  }

  if (isServerFailure(failure.statusCode)) {
    return { kind: "section", message: temporaryFailureMessage(provider) };
  }

  return { kind: "section", message: rejectedMessage(provider) };
}

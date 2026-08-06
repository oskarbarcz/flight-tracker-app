import { isServerFailure, unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";

export type EmailChangeFailure =
  | { kind: "field"; field: "newEmail" | "currentPassword"; message: string }
  | { kind: "section"; message: string }
  | { kind: "unavailable"; message: string };

const notDifferentBackendMessage = "must be different";
const alreadyInUseBackendMessage = "already in use";

const wrongCurrentPasswordMessage = "That is not your current password.";
const notDifferentMessage = "Your new address must be different from the one you sign in with now.";
const alreadyInUseMessage = "That address is already in use.";
const noPasswordToProveMessage =
  "This account signs in with Google and has no password to prove, so its address can't be changed here. Manage the address with Google instead.";
const temporaryFailureMessage = "Couldn't request the change right now. Try again in a moment.";
const rejectedChangeMessage = "The change couldn't be requested. Check the form and try again.";

type FailureReason = {
  statusCode?: number;
  message?: unknown;
  violations?: Record<string, string[]>;
};

function readReason(reason: unknown): FailureReason {
  return (reason ?? {}) as FailureReason;
}

function firstViolation(failure: FailureReason, field: string): string | undefined {
  return failure.violations?.[field]?.[0];
}

function reports(failure: FailureReason, expected: string): boolean {
  const message = failure.message;

  return typeof message === "string" && message.trim().toLowerCase().includes(expected);
}

export function describeEmailChangeFailure(reason: unknown): EmailChangeFailure {
  const failure = readReason(reason);

  const newEmailViolation = firstViolation(failure, "newEmail");
  if (newEmailViolation) {
    return { kind: "field", field: "newEmail", message: newEmailViolation };
  }

  const currentPasswordViolation = firstViolation(failure, "currentPassword");
  if (currentPasswordViolation) {
    return { kind: "field", field: "currentPassword", message: currentPasswordViolation };
  }

  if (failure.statusCode === 401) {
    return { kind: "field", field: "currentPassword", message: wrongCurrentPasswordMessage };
  }

  if (failure.statusCode === 400 && reports(failure, notDifferentBackendMessage)) {
    return { kind: "field", field: "newEmail", message: notDifferentMessage };
  }

  if (failure.statusCode === 409 && reports(failure, alreadyInUseBackendMessage)) {
    return { kind: "field", field: "newEmail", message: alreadyInUseMessage };
  }

  if (failure.statusCode === 409) {
    return { kind: "unavailable", message: noPasswordToProveMessage };
  }

  if (failure.statusCode === undefined) {
    return { kind: "section", message: unreachableServiceMessage };
  }

  if (isServerFailure(failure.statusCode)) {
    return { kind: "section", message: temporaryFailureMessage };
  }

  return { kind: "section", message: rejectedChangeMessage };
}

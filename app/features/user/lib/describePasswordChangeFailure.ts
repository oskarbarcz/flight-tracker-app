import { isServerFailure, unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";

export type PasswordChangeFailure =
  | { kind: "field"; field: "currentPassword" | "newPassword"; message: string }
  | { kind: "section"; message: string }
  | { kind: "unavailable"; message: string };

const notDifferentBackendMessage = "must be different";

const wrongCurrentPasswordMessage = "That is not your current password.";
const notDifferentMessage = "Your new password must be different from your current one.";
const noPasswordToChangeMessage =
  "This account signs in with Google and has no password to change. Manage your password with Google instead.";
const temporaryFailureMessage = "Couldn't change your password right now. Try again in a moment.";
const rejectedChangeMessage = "Your password couldn't be changed. Check the form and try again.";

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

export function describePasswordChangeFailure(reason: unknown): PasswordChangeFailure {
  const failure = readReason(reason);

  const newPasswordViolation = firstViolation(failure, "newPassword");
  if (newPasswordViolation) {
    return { kind: "field", field: "newPassword", message: newPasswordViolation };
  }

  const currentPasswordViolation = firstViolation(failure, "currentPassword");
  if (currentPasswordViolation) {
    return { kind: "field", field: "currentPassword", message: currentPasswordViolation };
  }

  if (failure.statusCode === 401) {
    return { kind: "field", field: "currentPassword", message: wrongCurrentPasswordMessage };
  }

  if (failure.statusCode === 400 && reports(failure, notDifferentBackendMessage)) {
    return { kind: "field", field: "newPassword", message: notDifferentMessage };
  }

  if (failure.statusCode === 409) {
    return { kind: "unavailable", message: noPasswordToChangeMessage };
  }

  if (failure.statusCode === undefined) {
    return { kind: "section", message: unreachableServiceMessage };
  }

  if (isServerFailure(failure.statusCode)) {
    return { kind: "section", message: temporaryFailureMessage };
  }

  return { kind: "section", message: rejectedChangeMessage };
}

import { isServerFailure, unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";

export type EmailChangeConfirmationFailure = {
  message: string;
  isRetryable: boolean;
};

const expiredLinkMessage =
  "This confirmation link no longer works. A link can be used once and expires 24 hours after it is sent. Sign in and request the change again from your account page.";
const addressTakenMessage =
  "That address was claimed by another account after you asked for the change. Sign in and request a different address.";
const stillUsableSuffix = "This link is still usable.";
const temporaryFailureMessage = `Couldn't confirm the address right now. ${stillUsableSuffix} Try again in a moment.`;
const rejectedConfirmationMessage =
  "The address couldn't be confirmed. Sign in and request the change again from your account page.";

type FailureReason = {
  statusCode?: number;
};

function readReason(reason: unknown): FailureReason {
  return (reason ?? {}) as FailureReason;
}

export function describeEmailChangeConfirmationFailure(reason: unknown): EmailChangeConfirmationFailure {
  const { statusCode } = readReason(reason);

  if (statusCode === 400) {
    return { message: expiredLinkMessage, isRetryable: false };
  }

  if (statusCode === 409) {
    return { message: addressTakenMessage, isRetryable: false };
  }

  if (statusCode === undefined) {
    return { message: `${unreachableServiceMessage} ${stillUsableSuffix}`, isRetryable: true };
  }

  if (isServerFailure(statusCode)) {
    return { message: temporaryFailureMessage, isRetryable: true };
  }

  return { message: rejectedConfirmationMessage, isRetryable: false };
}

import {
  failedLinkMessage,
  failedSignInMessage,
  isServerFailure,
  unreachableServiceMessage,
} from "~/features/auth/lib/serviceFailureMessages";

const backendMessages = {
  notLinked: "no user account is linked to this google account",
  emailNotVerified: "google account email address is not verified",
  userAlreadyLinked: "user already has a linked google account",
  linkedToAnotherUser: "this google account is already linked to another user",
} as const;

const notConnectedMessage =
  "This Google account isn't connected to a Flight Tracker account. Sign in with your email and password, then connect it from your account page.";
const emailNotVerifiedMessage =
  "Google hasn't verified this account's email address. Verify it with Google, then try again.";
const rejectedIdentityOnSignInMessage =
  "Google sign-in couldn't be completed. Try again, or use your email and password.";
const rejectedIdentityOnLinkMessage = "Your Google account couldn't be connected. Try again.";
const userAlreadyLinkedMessage =
  "This account already has a Google account connected. Only one can be connected at a time.";
const linkedToAnotherUserMessage =
  "This Google account is already connected to another Flight Tracker account. Choose a different Google account.";
const indistinguishableConflictMessage =
  "This Google account couldn't be connected: either this account or that Google account is already connected.";

type FailureReason = {
  statusCode?: number;
  message?: unknown;
};

function readReason(reason: unknown): FailureReason {
  return (reason ?? {}) as FailureReason;
}

function reports(reason: FailureReason, expected: string): boolean {
  const message = reason.message;

  return typeof message === "string" && message.trim().toLowerCase().includes(expected);
}

export function describeGoogleSignInFailure(reason: unknown): string {
  const failure = readReason(reason);

  if (reports(failure, backendMessages.notLinked)) {
    return notConnectedMessage;
  }

  if (reports(failure, backendMessages.emailNotVerified)) {
    return emailNotVerifiedMessage;
  }

  if (failure.statusCode === undefined) {
    return unreachableServiceMessage;
  }

  if (isServerFailure(failure.statusCode)) {
    return failedSignInMessage;
  }

  return rejectedIdentityOnSignInMessage;
}

export function describeGoogleLinkFailure(reason: unknown): string {
  const failure = readReason(reason);

  if (reports(failure, backendMessages.userAlreadyLinked)) {
    return userAlreadyLinkedMessage;
  }

  if (reports(failure, backendMessages.linkedToAnotherUser)) {
    return linkedToAnotherUserMessage;
  }

  if (failure.statusCode === 409) {
    return indistinguishableConflictMessage;
  }

  if (reports(failure, backendMessages.emailNotVerified)) {
    return emailNotVerifiedMessage;
  }

  if (failure.statusCode === undefined) {
    return unreachableServiceMessage;
  }

  if (isServerFailure(failure.statusCode)) {
    return failedLinkMessage;
  }

  return rejectedIdentityOnLinkMessage;
}

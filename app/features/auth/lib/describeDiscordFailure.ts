import { isServerFailure, unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";

const backendMessages = {
  notLinked: "no user account is linked to this discord account",
  joinNotAuthorized: "joining the server was not authorized",
  unreachable: "discord is unreachable",
  userAlreadyLinked: "user already has a linked discord account",
  linkedToAnotherUser: "this discord account is already linked to another user",
} as const;

const notConnectedMessage =
  "This Discord account isn't connected to a Flight Tracker account. Sign in with your email and password, then connect it from your account page.";
const rejectedIdentityOnSignInMessage =
  "Discord sign-in couldn't be completed. Try again, or use your email and password.";
const rejectedIdentityOnLinkMessage = "Your Discord account couldn't be connected. Try again.";
const userAlreadyLinkedMessage =
  "This account already has a Discord account connected. Only one can be connected at a time.";
const linkedToAnotherUserMessage =
  "This Discord account is already connected to another Flight Tracker account. Choose a different Discord account.";
const indistinguishableConflictMessage =
  "This Discord account couldn't be connected: either this account or that Discord account is already connected.";
const joinNotAuthorizedMessage =
  "Discord didn't grant permission to add you to the Flight Tracker server, so nothing was connected. Try again and allow it, or connect without joining the server.";
const discordUnavailableOnSignInMessage =
  "Discord isn't responding, so sign-in couldn't be completed. Try again later, or use your email and password.";
const discordUnavailableOnLinkMessage = "Discord isn't responding right now. Try connecting again in a moment.";
const failedDiscordSignInMessage = "Sign-in failed on our side. Try again in a moment.";
const failedDiscordLinkMessage = "Couldn't connect your Discord account right now. Try again in a moment.";

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

function reportsDiscordUnavailable(failure: FailureReason): boolean {
  return failure.statusCode === 502 || reports(failure, backendMessages.unreachable);
}

export function describeDiscordSignInFailure(reason: unknown): string {
  const failure = readReason(reason);

  if (reports(failure, backendMessages.notLinked)) {
    return notConnectedMessage;
  }

  if (reportsDiscordUnavailable(failure)) {
    return discordUnavailableOnSignInMessage;
  }

  if (failure.statusCode === undefined) {
    return unreachableServiceMessage;
  }

  if (isServerFailure(failure.statusCode)) {
    return failedDiscordSignInMessage;
  }

  return rejectedIdentityOnSignInMessage;
}

export function describeDiscordLinkFailure(reason: unknown): string {
  const failure = readReason(reason);

  if (reports(failure, backendMessages.joinNotAuthorized)) {
    return joinNotAuthorizedMessage;
  }

  if (reports(failure, backendMessages.userAlreadyLinked)) {
    return userAlreadyLinkedMessage;
  }

  if (reports(failure, backendMessages.linkedToAnotherUser)) {
    return linkedToAnotherUserMessage;
  }

  if (failure.statusCode === 409) {
    return indistinguishableConflictMessage;
  }

  if (reportsDiscordUnavailable(failure)) {
    return discordUnavailableOnLinkMessage;
  }

  if (failure.statusCode === undefined) {
    return unreachableServiceMessage;
  }

  if (isServerFailure(failure.statusCode)) {
    return failedDiscordLinkMessage;
  }

  return rejectedIdentityOnLinkMessage;
}

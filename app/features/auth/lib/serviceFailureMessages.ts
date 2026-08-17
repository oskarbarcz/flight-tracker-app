export const unreachableServiceMessage = "Can't reach MyPreflight. Check your connection and try again.";
export const failedSignInMessage = "Sign-in failed on our side. Try again in a moment.";
export const failedLinkMessage = "Couldn't connect your Google account right now. Try again in a moment.";

export function isServerFailure(statusCode: number): boolean {
  return statusCode >= 500;
}

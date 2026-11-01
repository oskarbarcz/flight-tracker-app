import { describeAuthClient } from "~/features/auth/lib/describeAuthClient";
import { unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";
import { AuthClient, type AuthSession } from "~/features/auth/model";
import { dateToIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { dateToIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";

const signOutFailureMessage = "Couldn’t sign out this device right now. Try again in a moment.";

export const sessionsLoadFailureMessage = "Signed-in devices could not be loaded. Reload the page to try again.";

function describeSignInTime(at: string): string {
  const date = new Date(at);

  return `${dateToIcaoDate(date)} ${dateToIcaoTime(date)}Z`;
}

export function describeSignOutConsequence(session: AuthSession): string {
  const device = describeAuthClient(session);

  if (session.client === AuthClient.Transponder) {
    return `The ${device} will be signed out and stop sending flight data until you sign it in again.`;
  }

  return `The ${device.toLowerCase()} signed in at ${describeSignInTime(session.createdAt)} will be signed out and will have to sign in again.`;
}

export function describeSignOutFailure(reason: unknown): string {
  const statusCode = (reason as { statusCode?: number } | null)?.statusCode;

  return statusCode === undefined ? unreachableServiceMessage : signOutFailureMessage;
}

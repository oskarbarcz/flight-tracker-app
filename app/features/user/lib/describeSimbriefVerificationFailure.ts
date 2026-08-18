import { unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";

export type SimbriefVerificationFailure = { kind: "field"; message: string } | { kind: "section"; message: string };

const unknownIdMessage = "SimBrief doesn't know this ID. Check it in your SimBrief account settings.";
const noAnswerMessage = "SimBrief didn't answer. Try again in a moment.";
const temporaryFailureMessage = "Couldn't check the ID with SimBrief right now. Try again in a moment.";

type FailureReason = {
  statusCode?: number;
};

export function describeSimbriefVerificationFailure(reason: unknown): SimbriefVerificationFailure {
  const { statusCode } = (reason ?? {}) as FailureReason;

  if (statusCode === 404) {
    return { kind: "field", message: unknownIdMessage };
  }

  if (statusCode === 502) {
    return { kind: "section", message: noAnswerMessage };
  }

  if (statusCode === undefined) {
    return { kind: "section", message: unreachableServiceMessage };
  }

  return { kind: "section", message: temporaryFailureMessage };
}

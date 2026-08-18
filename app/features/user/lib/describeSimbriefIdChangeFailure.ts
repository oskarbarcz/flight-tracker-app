import { isServerFailure, unreachableServiceMessage } from "~/features/auth/lib/serviceFailureMessages";

export type SimbriefIdChangeFailure = { kind: "field"; message: string } | { kind: "section"; message: string };

const temporaryFailureMessage = "Couldn't save the SimBrief ID right now. Try again in a moment.";
const rejectedChangeMessage = "The SimBrief ID wasn't accepted. Check it and try again.";

type FailureReason = {
  statusCode?: number;
  violations?: Record<string, string[]>;
};

export function describeSimbriefIdChangeFailure(reason: unknown): SimbriefIdChangeFailure {
  const failure = (reason ?? {}) as FailureReason;
  const violation = failure.violations?.simbriefUserId?.[0];

  if (violation) {
    return { kind: "field", message: violation };
  }

  if (failure.statusCode === undefined) {
    return { kind: "section", message: unreachableServiceMessage };
  }

  if (isServerFailure(failure.statusCode)) {
    return { kind: "section", message: temporaryFailureMessage };
  }

  return { kind: "section", message: rejectedChangeMessage };
}

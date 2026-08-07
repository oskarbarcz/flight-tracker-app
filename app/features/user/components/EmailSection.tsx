import { Button } from "flowbite-react";
import { useState } from "react";
import { FaCircleExclamation, FaCircleInfo } from "react-icons/fa6";
import { useAuth } from "~/app-state/useAuth";
import { ChangeEmailModal } from "~/features/user/components/ChangeEmailModal";
import { PendingEmailChange } from "~/features/user/components/PendingEmailChange";
import { pendingEmail } from "~/features/user/lib/accountEmails";
import { RecordRow } from "~/shared/ui/Record/RecordRow";
import { RecordValue } from "~/shared/ui/Record/RecordValue";

type SectionState =
  | { status: "idle" }
  | { status: "requested"; requestedEmail: string; pendingBefore: string | null }
  | { status: "unavailable"; message: string };

type RequestOutcome =
  | { kind: "none" }
  | { kind: "sent" }
  | { kind: "unconfirmedDelivery" }
  | { kind: "sentToUnreportedAddress"; requestedEmail: string }
  | { kind: "suppressed"; requestedEmail: string };

function describeRequestOutcome(state: SectionState, pending: string | null): RequestOutcome {
  if (state.status !== "requested") {
    return { kind: "none" };
  }

  if (pending === null) {
    return { kind: "sentToUnreportedAddress", requestedEmail: state.requestedEmail };
  }

  if (pending !== state.requestedEmail.trim().toLowerCase()) {
    return { kind: "suppressed", requestedEmail: state.requestedEmail };
  }

  return state.pendingBefore === pending ? { kind: "unconfirmedDelivery" } : { kind: "sent" };
}

export function EmailSection() {
  const { user, refreshUser } = useAuth();
  const [state, setState] = useState<SectionState>({ status: "idle" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (user === null) {
    return null;
  }

  const pending = pendingEmail(user);
  const outcome = describeRequestOutcome(state, pending);

  function closeModal() {
    setIsModalOpen(false);
  }

  if (state.status === "unavailable") {
    return (
      <RecordRow label="Email">
        <RecordValue>{user.email}</RecordValue>
        <p className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-pretty text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <FaCircleInfo aria-hidden className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      </RecordRow>
    );
  }

  return (
    <RecordRow
      label="Email"
      action={
        <Button color="light" size="sm" className="min-h-10 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          Change email
        </Button>
      }
      detail={
        (pending !== null || outcome.kind === "suppressed") && (
          <div className="space-y-4">
            {outcome.kind === "suppressed" && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-pretty text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
              >
                <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
                <span>
                  No link was sent to <span className="font-mono">{outcome.requestedEmail}</span> — a change is already
                  awaiting confirmation. Wait five minutes from the last request, then ask again to replace it.
                </span>
              </p>
            )}

            {pending !== null && (
              <PendingEmailChange
                pendingAddress={pending}
                activeAddress={user.email}
                wasJustSent={outcome.kind === "sent"}
              />
            )}
          </div>
        )
      }
    >
      <RecordValue>{user.email}</RecordValue>

      {outcome.kind === "sentToUnreportedAddress" && (
        <p role="status" className="text-pretty text-sm text-gray-600 dark:text-gray-400">
          Confirmation link sent to{" "}
          <span className="font-mono text-gray-900 dark:text-gray-100">{outcome.requestedEmail}</span>.
        </p>
      )}

      {isModalOpen && (
        <ChangeEmailModal
          close={closeModal}
          onRequested={(requestedEmail) => {
            const pendingBefore = pending;
            closeModal();
            refreshUser().finally(() => setState({ status: "requested", requestedEmail, pendingBefore }));
          }}
          onUnavailable={(message) => {
            setState({ status: "unavailable", message });
            closeModal();
          }}
        />
      )}
    </RecordRow>
  );
}

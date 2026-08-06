import { Button } from "flowbite-react";
import { useState } from "react";
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { useAuth } from "~/app-state/useAuth";
import { ChangeEmailModal } from "~/features/user/components/ChangeEmailModal";
import { pendingEmail } from "~/features/user/lib/accountEmails";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type SectionState =
  | { status: "idle" }
  | { status: "requested"; requestedEmail: string }
  | { status: "unavailable"; message: string };

type RequestOutcome =
  | { kind: "none" }
  | { kind: "sent" }
  | { kind: "sentToUnreportedAddress"; requestedEmail: string }
  | { kind: "suppressed"; requestedEmail: string };

const activeLabel = "Signs in with";
const pendingLabel = "Awaiting confirmation";
const linkSentNotice = "Confirmation link sent. Open it from that mailbox to finish moving your account.";
const pendingExplanation =
  "The link works once and expires 24 hours after it was sent. You keep signing in with your current address until it is opened.";
const resendGuardNotice =
  "Another request within five minutes of the last one sends no new link and leaves this address pending.";
const suppressedExplanation =
  ": your account already has a change awaiting confirmation. Wait five minutes from the last request, then ask again to replace it.";

function describeRequestOutcome(state: SectionState, pending: string | null): RequestOutcome {
  if (state.status !== "requested") {
    return { kind: "none" };
  }

  if (pending === null) {
    return { kind: "sentToUnreportedAddress", requestedEmail: state.requestedEmail };
  }

  if (pending === state.requestedEmail.trim().toLowerCase()) {
    return { kind: "sent" };
  }

  return { kind: "suppressed", requestedEmail: state.requestedEmail };
}

type AddressProps = {
  label: string;
  address: string;
  labelClassName?: string;
};

function AddressBlock({ label, address, labelClassName }: AddressProps) {
  return (
    <div>
      <FieldLabel className={labelClassName}>{label}</FieldLabel>
      <p className="mt-1 break-all font-medium text-gray-700 dark:text-gray-200">{address}</p>
    </div>
  );
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

  return (
    <Container>
      <ContainerTitle icon={HiOutlineEnvelope} title="Email" />

      {state.status === "unavailable" ? (
        <p className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-pretty text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <FaCircleInfo aria-hidden className="mt-0.5 shrink-0" />
          <span>{state.message}</span>
        </p>
      ) : (
        <>
          <AddressBlock label={activeLabel} address={user.email} />

          {outcome.kind === "sentToUnreportedAddress" && (
            <p className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
              <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
              <span>
                We sent a confirmation link to <span className="break-all font-medium">{outcome.requestedEmail}</span>.
              </span>
            </p>
          )}

          {outcome.kind === "suppressed" && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-pretty text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
            >
              <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
              <span>
                No link was sent to <span className="break-all font-medium">{outcome.requestedEmail}</span>
                {suppressedExplanation}
              </span>
            </p>
          )}

          {pending !== null && (
            <div className="space-y-2 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800">
              {outcome.kind === "sent" && (
                <p className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
                  <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
                  <span>{linkSentNotice}</span>
                </p>
              )}
              <AddressBlock
                label={pendingLabel}
                address={pending}
                labelClassName="text-amber-700 dark:text-amber-400"
              />
              <p className="text-pretty text-sm text-gray-600 dark:text-gray-300">{pendingExplanation}</p>
              <p className="text-pretty text-sm text-gray-600 dark:text-gray-300">{resendGuardNotice}</p>
            </div>
          )}

          <div className="flex justify-start">
            <Button color="indigo" onClick={() => setIsModalOpen(true)}>
              Change email
            </Button>
          </div>
        </>
      )}

      {isModalOpen && (
        <ChangeEmailModal
          close={closeModal}
          onRequested={(requestedEmail) => {
            closeModal();
            refreshUser().finally(() => setState({ status: "requested", requestedEmail }));
          }}
          onUnavailable={(message) => {
            setState({ status: "unavailable", message });
            closeModal();
          }}
        />
      )}
    </Container>
  );
}

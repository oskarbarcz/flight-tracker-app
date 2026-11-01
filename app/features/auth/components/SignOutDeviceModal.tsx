import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { describeSignOutConsequence, describeSignOutFailure } from "~/features/auth/lib/authSessions";
import type { AuthSession } from "~/features/auth/model";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  session: AuthSession;
  signOut: (session: AuthSession) => Promise<void>;
  close: () => void;
  onSignedOut: () => void;
};

export function SignOutDeviceModal({ session, signOut, close, onSignedOut }: Props) {
  const [pending, setPending] = useState<boolean>(false);
  const [failure, setFailure] = useState<string | null>(null);

  function confirm() {
    if (pending) {
      return;
    }

    setPending(true);
    setFailure(null);

    signOut(session)
      .then(onSignedOut)
      .catch((reason) => {
        setFailure(describeSignOutFailure(reason));
        setPending(false);
      });
  }

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Account" action="Sign out device" />
      </ModalHeader>
      <ModalBody>
        <p className="text-pretty text-sm text-gray-600 dark:text-gray-300">{describeSignOutConsequence(session)}</p>

        {failure !== null && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
          >
            <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
            <span>{failure}</span>
          </p>
        )}
      </ModalBody>
      <ModalActions
        cancel={{ onClick: close }}
        confirm={{ label: "Sign out", onClick: confirm, tone: "danger" }}
        pending={pending}
        pendingLabel="Signing out…"
      />
    </Modal>
  );
}

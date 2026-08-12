import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import { FaCircleExclamation } from "react-icons/fa6";
import { type DisconnectAccountFormData, disconnectAccountSchema, initDisconnectAccountData } from "~/features/auth";
import { describeUnlinkFailure, type UnlinkProvider } from "~/features/auth/lib/describeUnlinkFailure";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  provider: UnlinkProvider;
  consequences: string[];
  disconnect: (currentPassword: string) => Promise<void>;
  close: () => void;
  onDisconnected: () => void;
  onBlocked: (message: string) => void;
  onAbsent: () => void;
};

export function DisconnectAccountModal({
  provider,
  consequences,
  disconnect,
  close,
  onDisconnected,
  onBlocked,
  onAbsent,
}: Props) {
  async function handleSubmit(
    values: DisconnectAccountFormData,
    { setFieldError, setStatus, setSubmitting }: FormikHelpers<DisconnectAccountFormData>,
  ) {
    setStatus(undefined);

    try {
      await disconnect(values.currentPassword);
      onDisconnected();
      return;
    } catch (reason) {
      const failure = describeUnlinkFailure(reason, provider);

      if (failure.kind === "password") {
        setFieldError("currentPassword", failure.message);
      } else if (failure.kind === "blocked") {
        onBlocked(failure.message);
        return;
      } else if (failure.kind === "absent") {
        onAbsent();
        return;
      } else {
        setStatus(failure.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Account" action={`Disconnect ${provider}`} />
      </ModalHeader>
      <Formik<DisconnectAccountFormData>
        initialValues={initDisconnectAccountData()}
        validationSchema={disconnectAccountSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <>
            <ModalBody>
              <FormikForm id="disconnectAccountForm" noValidate>
                <div className="mb-4 space-y-2 text-pretty text-sm text-gray-600 dark:text-gray-400">
                  {consequences.map((consequence) => (
                    <p key={consequence}>{consequence}</p>
                  ))}
                </div>

                <ManagedInputBlock
                  field="currentPassword"
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                  autoFocus
                  disabled={isSubmitting}
                />

                {typeof status === "string" && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
                  >
                    <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
                    <span>{status}</span>
                  </p>
                )}
              </FormikForm>
            </ModalBody>
            <ModalActions
              cancel={{ onClick: close }}
              confirm={{
                label: `Disconnect ${provider}`,
                type: "submit",
                form: "disconnectAccountForm",
                tone: "danger",
              }}
              pending={isSubmitting}
              pendingLabel="Disconnecting…"
            />
          </>
        )}
      </Formik>
    </Modal>
  );
}

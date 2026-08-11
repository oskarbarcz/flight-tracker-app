import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import { FaCircleExclamation } from "react-icons/fa6";
import { useAuth } from "~/app-state/useAuth";
import { type ChangePasswordFormData, changePasswordSchema, initChangePasswordData } from "~/features/user";
import { pendingEmail } from "~/features/user/lib/accountEmails";
import { describePasswordChangeFailure } from "~/features/user/lib/describePasswordChangeFailure";
import { passwordPolicyDescription } from "~/features/user/schema";
import { useApi } from "~/shared/api/useApi";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  close: () => void;
  onChanged: () => void;
  onUnavailable: (message: string) => void;
};

const otherSessionsWarning = "Changing your password signs you out everywhere else. This session stays signed in.";
const pendingEmailWarning =
  "It also cancels the email change waiting for confirmation — the link sent to the new address will stop working.";

export function ChangePasswordModal({ close, onChanged, onUnavailable }: Props) {
  const { userService } = useApi();
  const { user } = useAuth();
  const hasPendingEmailChange = user !== null && pendingEmail(user) !== null;

  async function handleSubmit(
    values: ChangePasswordFormData,
    { setFieldError, setStatus, setSubmitting }: FormikHelpers<ChangePasswordFormData>,
  ) {
    setStatus(undefined);

    try {
      await userService.changePassword(values.currentPassword, values.newPassword);
      onChanged();
      return;
    } catch (reason) {
      const failure = describePasswordChangeFailure(reason);

      if (failure.kind === "field") {
        setFieldError(failure.field, failure.message);
      } else if (failure.kind === "unavailable") {
        onUnavailable(failure.message);
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
        <ModalTitle context="Account" action="Change password" />
      </ModalHeader>
      <Formik<ChangePasswordFormData>
        initialValues={initChangePasswordData()}
        validationSchema={changePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <>
            <ModalBody>
              <FormikForm id="changePasswordForm" noValidate>
                <div className="mb-4 space-y-2 text-pretty text-sm text-gray-600 dark:text-gray-400">
                  <p>{otherSessionsWarning}</p>
                  {hasPendingEmailChange && <p>{pendingEmailWarning}</p>}
                </div>

                <ManagedInputBlock
                  field="currentPassword"
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                  autoFocus
                  disabled={isSubmitting}
                />

                <ManagedInputBlock
                  field="newPassword"
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  helperText={passwordPolicyDescription}
                  disabled={isSubmitting}
                />

                <ManagedInputBlock
                  field="confirmNewPassword"
                  label="Confirm new password"
                  type="password"
                  autoComplete="new-password"
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
              confirm={{ label: "Change password", type: "submit", form: "changePasswordForm" }}
              pending={isSubmitting}
              pendingLabel="Changing…"
            />
          </>
        )}
      </Formik>
    </Modal>
  );
}

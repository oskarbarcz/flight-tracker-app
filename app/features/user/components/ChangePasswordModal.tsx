import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import { FaCircleExclamation } from "react-icons/fa6";
import { type ChangePasswordFormData, changePasswordSchema, initChangePasswordData } from "~/features/user";
import { describePasswordChangeFailure } from "~/features/user/lib/describePasswordChangeFailure";
import { passwordPolicyDescription } from "~/features/user/schema";
import { useApi } from "~/shared/api/useApi";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";

type Props = {
  close: () => void;
  onChanged: () => void;
  onUnavailable: (message: string) => void;
};

const otherSessionsWarning = "Changing your password signs you out everywhere else. This session stays signed in.";

export function ChangePasswordModal({ close, onChanged, onUnavailable }: Props) {
  const { userService } = useApi();

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
      <ModalHeader>Change password</ModalHeader>
      <Formik<ChangePasswordFormData>
        initialValues={initChangePasswordData()}
        validationSchema={changePasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <>
            <ModalBody>
              <FormikForm id="changePasswordForm" noValidate>
                <p className="mb-4 text-pretty text-sm text-gray-600 dark:text-gray-400">{otherSessionsWarning}</p>

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
            <ModalFooter>
              <div className="ms-auto flex gap-2">
                <Button color="gray" outline disabled={isSubmitting} onClick={close}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="changePasswordForm"
                  color="indigo"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Changing…" : "Change password"}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </Formik>
    </Modal>
  );
}

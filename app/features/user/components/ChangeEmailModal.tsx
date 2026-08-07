import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import { FaCircleExclamation } from "react-icons/fa6";
import { useAuth } from "~/app-state/useAuth";
import { type ChangeEmailFormData, changeEmailSchema, initChangeEmailData } from "~/features/user";
import { describeEmailChangeFailure } from "~/features/user/lib/describeEmailChangeFailure";
import { useApi } from "~/shared/api/useApi";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";

type Props = {
  close: () => void;
  onRequested: (newEmail: string) => void;
  onUnavailable: (message: string) => void;
};

export function ChangeEmailModal({ close, onRequested, onUnavailable }: Props) {
  const { userService } = useApi();
  const { user } = useAuth();

  async function handleSubmit(
    values: ChangeEmailFormData,
    { setFieldError, setStatus, setSubmitting }: FormikHelpers<ChangeEmailFormData>,
  ) {
    setStatus(undefined);

    try {
      await userService.requestEmailChange(values.newEmail, values.currentPassword);
      onRequested(values.newEmail);
      return;
    } catch (reason) {
      const failure = describeEmailChangeFailure(reason);

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
      <ModalHeader>Change email address</ModalHeader>
      <Formik<ChangeEmailFormData>
        initialValues={initChangeEmailData()}
        validationSchema={changeEmailSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <>
            <ModalBody>
              <FormikForm id="changeEmailForm" noValidate>
                <ul className="mb-5 list-disc space-y-1.5 pl-4 text-pretty text-sm text-gray-600 marker:text-gray-400 dark:text-gray-400">
                  <li>
                    We email a confirmation link to the new address. It works{" "}
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">once</strong> and expires in{" "}
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">24 hours</strong>.
                  </li>
                  {user !== null && (
                    <li>
                      You keep signing in with{" "}
                      <span className="font-mono text-gray-900 dark:text-gray-100">{user.email}</span> until you open
                      it.
                    </li>
                  )}
                  <li>
                    Opening it signs you out on{" "}
                    <strong className="font-semibold text-gray-900 dark:text-gray-100">
                      every device, including this one
                    </strong>
                    .
                  </li>
                </ul>

                <ManagedInputBlock
                  field="newEmail"
                  label="New email address"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  disabled={isSubmitting}
                />

                <ManagedInputBlock
                  field="currentPassword"
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
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
                  form="changeEmailForm"
                  color="indigo"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Sending…" : "Send confirmation link"}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </Formik>
    </Modal>
  );
}

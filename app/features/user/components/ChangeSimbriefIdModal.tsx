import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import { useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { useAuth } from "~/app-state/useAuth";
import {
  type ChangeSimbriefIdFormData,
  changeSimbriefIdSchema,
  initChangeSimbriefIdData,
  type SimbriefAccount,
} from "~/features/user";
import { SimbriefAccountPreview } from "~/features/user/components/SimbriefAccountPreview";
import { describeSimbriefIdChangeFailure } from "~/features/user/lib/describeSimbriefIdChangeFailure";
import { describeSimbriefVerificationFailure } from "~/features/user/lib/describeSimbriefVerificationFailure";
import { useApi } from "~/shared/api/useApi";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  current: string | null;
  close: () => void;
  onSaved: (simbriefUserId: string | null) => void;
};

export function ChangeSimbriefIdModal({ current, close, onSaved }: Props) {
  const { userService } = useApi();
  const { refreshUser } = useAuth();
  const [verified, setVerified] = useState<SimbriefAccount | null>(null);

  async function save(
    simbriefUserId: string | null,
    { setFieldError, setStatus }: FormikHelpers<ChangeSimbriefIdFormData>,
  ) {
    try {
      await userService.updateOwnProfile({ simbriefUserId });
      await refreshUser();
      onSaved(simbriefUserId);
    } catch (reason) {
      const failure = describeSimbriefIdChangeFailure(reason);

      if (failure.kind === "field") {
        setFieldError("simbriefUserId", failure.message);
      } else {
        setStatus(failure.message);
      }
    }
  }

  async function verify(simbriefUserId: string, { setFieldError, setStatus }: FormikHelpers<ChangeSimbriefIdFormData>) {
    try {
      setVerified(await userService.verifySimbriefUser(simbriefUserId));
    } catch (reason) {
      const failure = describeSimbriefVerificationFailure(reason);

      if (failure.kind === "field") {
        setFieldError("simbriefUserId", failure.message);
      } else {
        setStatus(failure.message);
      }
    }
  }

  async function handleSubmit(values: ChangeSimbriefIdFormData, helpers: FormikHelpers<ChangeSimbriefIdFormData>) {
    const entered = values.simbriefUserId.trim();

    helpers.setStatus(undefined);

    if (entered === "") {
      await save(null, helpers);
    } else if (verified?.simbriefUserId === entered) {
      await save(entered, helpers);
    } else {
      await verify(entered, helpers);
    }

    helpers.setSubmitting(false);
  }

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="SimBrief" action={current === null ? "Connect" : "Change ID"} />
      </ModalHeader>
      <Formik<ChangeSimbriefIdFormData>
        initialValues={initChangeSimbriefIdData(current)}
        validationSchema={changeSimbriefIdSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status, values }) => {
          const entered = values.simbriefUserId.trim();
          const isDisconnecting = entered === "" && current !== null;
          const verifiedAccount = entered !== "" && verified?.simbriefUserId === entered ? verified : null;

          return (
            <>
              <ModalBody>
                <FormikForm id="changeSimbriefIdForm" noValidate>
                  <ul className="mb-5 list-disc space-y-1.5 pl-4 text-pretty text-sm text-gray-600 marker:text-gray-400 dark:text-gray-400">
                    <li>
                      Find your ID on SimBrief under{" "}
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Account Settings</span>. It is
                      the numeric <span className="font-semibold text-gray-900 dark:text-gray-100">Pilot ID</span>, not
                      your username.
                    </li>
                    <li>
                      We check the ID with SimBrief before saving it, and read your latest OFP with it when you import a
                      flight. We never post anything back.
                    </li>
                    {current !== null && <li>Leave the field empty to disconnect SimBrief.</li>}
                  </ul>

                  <ManagedInputBlock
                    field="simbriefUserId"
                    label="SimBrief Pilot ID"
                    required={false}
                    autoComplete="off"
                    autoFocus
                    disabled={isSubmitting}
                    helperText="Digits only, for example 123456."
                  />

                  {verifiedAccount !== null && <SimbriefAccountPreview account={verifiedAccount} />}

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
                  label: isDisconnecting
                    ? "Disconnect"
                    : verifiedAccount !== null
                      ? "Save changes"
                      : "Check with SimBrief",
                  tone: isDisconnecting ? "danger" : "primary",
                  type: "submit",
                  form: "changeSimbriefIdForm",
                  disabled: entered === (current ?? ""),
                }}
                pending={isSubmitting}
                pendingLabel={isDisconnecting || verifiedAccount !== null ? "Saving…" : "Checking…"}
              />
            </>
          );
        }}
      </Formik>
    </Modal>
  );
}

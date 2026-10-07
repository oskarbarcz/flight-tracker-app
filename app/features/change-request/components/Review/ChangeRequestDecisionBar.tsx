import { Button, Spinner } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "~/app-state/useToast";
import {
  initRejectChangeRequestData,
  type RejectChangeRequestFormData,
  rejectChangeRequestFormDataToRequest,
} from "~/features/change-request/form";
import { deletedProposedReferences } from "~/features/change-request/lib/changeRequestFields";
import { describeChangeRequestTarget } from "~/features/change-request/lib/changeRequestHeadline";
import type { ChangeRequestDetail } from "~/features/change-request/model";
import { rejectChangeRequestSchema } from "~/features/change-request/schema";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { ManagedTextareaBlock } from "~/shared/ui/Form/Managed/ManagedTextareaBlock";

const REASON_FIELD = "rejectionReason";

type Props = {
  detail: ChangeRequestDetail;
  onDecided: (decided: ChangeRequestDetail) => void;
  onStale: () => void;
};

type ApiFailure = { statusCode?: number; message?: string } | undefined;

function AcceptSummary({ detail, deletedReferences }: { detail: ChangeRequestDetail; deletedReferences: string[] }) {
  if (detail.isTargetGone) {
    return (
      <p className="hidden text-sm text-gray-700 sm:block dark:text-gray-300">
        The record was deleted after this was proposed, so there is nothing to apply it to.
      </p>
    );
  }

  if (deletedReferences.length > 0) {
    return (
      <p className="text-sm text-gray-700 dark:text-gray-300">
        The proposed {deletedReferences.join(" and ")} no longer exists, so this cannot be applied.
      </p>
    );
  }

  const count = detail.fields.length;
  return (
    <p className="hidden text-sm text-gray-600 sm:block dark:text-gray-300">
      Accepting writes <span className="font-mono tabular-nums text-gray-900 dark:text-white">{count}</span>{" "}
      {count === 1 ? "value" : "values"} to {describeChangeRequestTarget(detail)} straight away.
    </p>
  );
}

export function ChangeRequestDecisionBar({ detail, onDecided, onStale }: Props) {
  const { changeRequestService } = useApi();
  const { success, error, warning } = useToast();
  const [isRejecting, setIsRejecting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const rejectButton = useRef<HTMLButtonElement>(null);
  const restoresRejectFocus = useRef(false);
  const target = describeChangeRequestTarget(detail);
  const deletedReferences = deletedProposedReferences(detail.resource, detail.fields);
  const canApply = !detail.isTargetGone && deletedReferences.length === 0;

  useEffect(() => {
    if (isRejecting) {
      document.getElementById(REASON_FIELD)?.focus();
      return;
    }
    if (restoresRejectFocus.current) {
      restoresRejectFocus.current = false;
      rejectButton.current?.focus();
    }
  }, [isRejecting]);

  const closeRejectForm = () => {
    restoresRejectFocus.current = true;
    setIsRejecting(false);
  };

  const handleStale = (reason: unknown): boolean => {
    const { statusCode, message } = (reason as ApiFailure) ?? {};
    if (statusCode === 409) {
      warning("Someone else already decided this proposal. Showing its current state.");
      onStale();
      return true;
    }
    if (statusCode === 404) {
      error(
        message ? `Nothing was applied. ${message}` : `Nothing was applied to ${target}: a record it needs is gone.`,
      );
      onStale();
      return true;
    }
    return false;
  };

  const accept = async () => {
    setIsAccepting(true);
    try {
      const decided = await changeRequestService.accept(detail.id);
      success(`${target} updated.`);
      onDecided(decided);
    } catch (reason) {
      if (!handleStale(reason)) {
        error("The proposal could not be accepted. Try again.");
      }
    } finally {
      setIsAccepting(false);
    }
  };

  const reject = async (
    values: RejectChangeRequestFormData,
    { setErrors, setSubmitting }: FormikHelpers<RejectChangeRequestFormData>,
  ) => {
    try {
      const decided = await changeRequestService.reject(detail.id, rejectChangeRequestFormDataToRequest(values));
      success(`Proposal rejected. ${detail.requestedBy.name} will see your reason.`);
      onDecided(decided);
    } catch (reason) {
      if (!handleStale(reason)) {
        handleFormikApiError<RejectChangeRequestFormData>(
          reason,
          setErrors,
          error,
          "The proposal could not be rejected.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky bottom-[calc(5.75rem_+_env(safe-area-inset-bottom))] z-10 rounded-2xl border border-gray-200 bg-white p-3 md:bottom-6 dark:border-gray-800 dark:bg-gray-900">
      {isRejecting ? (
        <Formik<RejectChangeRequestFormData>
          initialValues={initRejectChangeRequestData()}
          validationSchema={rejectChangeRequestSchema()}
          onSubmit={reject}
        >
          {({ isSubmitting }) => (
            <FormikForm
              noValidate
              className="flex flex-col gap-3"
              onKeyDown={(event) => {
                if (event.key === "Escape" && !isSubmitting) {
                  closeRejectForm();
                }
              }}
            >
              <ManagedTextareaBlock
                field={REASON_FIELD}
                label={`Reason for ${detail.requestedBy.name}`}
                placeholder="What is wrong with the proposed values?"
              />
              <div className="flex flex-wrap justify-end gap-2">
                <Button color="alternative" disabled={isSubmitting} onClick={closeRejectForm}>
                  Cancel
                </Button>
                <Button color="red" type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Spinner size="sm" className="me-2" light />}
                  Reject proposal
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <AcceptSummary detail={detail} deletedReferences={deletedReferences} />
          <div className="ms-auto flex gap-2">
            <Button ref={rejectButton} color="alternative" disabled={isAccepting} onClick={() => setIsRejecting(true)}>
              Reject…
            </Button>
            <Button color="indigo" disabled={isAccepting || !canApply} onClick={accept}>
              {isAccepting && <Spinner size="sm" className="me-2" light />}
              Accept and apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

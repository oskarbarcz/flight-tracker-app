import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React, { useRef } from "react";
import { useToast } from "~/app-state/useToast";
import { FIXED_FIGURE, FIXED_SUFFIX } from "~/features/route/components/Chart/FixFigure";
import { fixName } from "~/features/route/lib/fixName";
import { formatTonnesFromKilograms } from "~/features/route/lib/routeFigures";
import type { PlannedRouteFix } from "~/features/route/model";
import { fixFuelReportSchema } from "~/features/route/schema";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FocusFirstError } from "~/shared/ui/Form/FocusFirstError";
import { FormDensityProvider } from "~/shared/ui/Form/formDensity";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type FormData = {
  actualOnBoard: number | "";
};

type Props = {
  fix: PlannedRouteFix;
  onReport: (ordinal: number, actualOnBoard: number) => Promise<void>;
  close: () => void;
};

function initialValues(actualOnBoard: number | undefined): FormData {
  return { actualOnBoard: actualOnBoard === undefined ? "" : actualOnBoard / 1000 };
}

export function FixFuelReportModal({ fix, onReport, close }: Props) {
  const { error } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const plannedOnBoard = fix.fuel.plannedOnBoard;

  const handleSubmit = async (values: FormData, { setErrors, setSubmitting }: FormikHelpers<FormData>) => {
    try {
      await onReport(fix.ordinal, Math.round(Number(values.actualOnBoard) * 1000));
      close();
    } catch (err) {
      handleFormikApiError<FormData>(err, setErrors, error, "Failed to save the actual fuel. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="sm" show onClose={close} initialFocus={inputRef}>
      <ModalHeader>
        <ModalTitle context="Fuel Report" action={`${fixName(fix.ident)} fix`} />
      </ModalHeader>
      <Formik<FormData>
        initialValues={initialValues(fix.fuelReport?.actualOnBoard)}
        validationSchema={fixFuelReportSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <FormikForm noValidate className="flex min-h-0 flex-1 flex-col">
            <FocusFirstError />
            <ModalBody>
              <FormDensityProvider density="compact">
                <ManagedFloatingInputBlock
                  field="actualOnBoard"
                  label="Fuel on board"
                  type="number"
                  autoComplete="off"
                  unit="t"
                  required={false}
                  inputRef={inputRef}
                  description={
                    plannedOnBoard !== null && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Flight plan EFOB{" "}
                        <span className={FIXED_FIGURE}>
                          {formatTonnesFromKilograms(plannedOnBoard)}
                          <span className={FIXED_SUFFIX}>t</span>
                        </span>
                      </p>
                    )
                  }
                />
              </FormDensityProvider>
            </ModalBody>
            <ModalActions
              cancel={{ onClick: close }}
              confirm={{ label: "Save", type: "submit" }}
              pending={isSubmitting}
              pendingLabel="Saving…"
            />
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
}

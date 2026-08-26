import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import type { FormikProps } from "formik";
import React, { useRef, useState } from "react";
import { CrosscheckConfirmation } from "~/features/flight/components/Forms/CrosscheckConfirmation";
import { LoadsheetFuelStep } from "~/features/flight/components/Forms/LoadsheetFuelStep";
import { LoadsheetLoadStep } from "~/features/flight/components/Forms/LoadsheetLoadStep";
import { FUEL_STEP_FIELDS, LOAD_STEP_FIELDS } from "~/features/flight/components/Forms/loadsheetFields";
import {
  type FlatLoadsheetFormData,
  flatLoadsheetToLoadsheet,
  loadsheetToFlatLoadsheet,
} from "~/features/flight/form-types";
import type { CabinCapacity } from "~/features/flight/hooks/useCabinCapacity";
import type { FlightServiceType, Loadsheet, Timesheet } from "~/features/flight/model";
import { updatePreliminaryLoadsheetSchema } from "~/features/flight/schema";
import { Form } from "~/shared/ui/Form/Form";
import { FormDensityProvider } from "~/shared/ui/Form/formDensity";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

export type LoadsheetStep = "load" | "fuel" | "notoc";

type Props = {
  action: Record<LoadsheetStep, string>;
  serviceType: FlightServiceType;
  formId: string;
  loadsheet: Loadsheet;
  timesheet: Timesheet;
  capacity: CabinCapacity | null;
  confirmLabel: string;
  confirmTrailing?: React.ReactNode;
  requiresConfirmation?: boolean;
  notoc?: React.ReactNode;
  initialValues?: FlatLoadsheetFormData;
  submit: (loadsheet: Loadsheet) => void;
  cancel: () => void;
};

function touchedFields(fields: string[]): Record<string, boolean> {
  return Object.fromEntries(fields.map((field) => [field, true]));
}

export function LoadsheetFormModal({
  action,
  serviceType,
  formId,
  loadsheet,
  timesheet,
  capacity,
  confirmLabel,
  confirmTrailing,
  requiresConfirmation = false,
  notoc,
  initialValues,
  submit,
  cancel,
}: Props) {
  const steps: LoadsheetStep[] = notoc === undefined ? ["load", "fuel"] : ["load", "fuel", "notoc"];
  const [step, setStep] = useState<LoadsheetStep>("load");
  const [confirmed, setConfirmed] = useState<Record<LoadsheetStep, boolean>>({
    load: false,
    fuel: false,
    notoc: false,
  });
  const formik = useRef<FormikProps<FlatLoadsheetFormData>>(null);

  const index = steps.indexOf(step);
  const isLast = index === steps.length - 1;
  const locked = requiresConfirmation && confirmed[step];
  const canContinue = !requiresConfirmation || confirmed[step];

  const fieldsOf = (current: LoadsheetStep) => (current === "load" ? LOAD_STEP_FIELDS : FUEL_STEP_FIELDS);

  const advance = async () => {
    const form = formik.current;

    if (!form) {
      return;
    }

    const fields = fieldsOf(step);
    const errors = await form.validateForm();
    form.setTouched({ ...form.touched, ...touchedFields(fields) });

    if (!fields.some((field) => field in errors)) {
      setStep(steps[index + 1]);
    }
  };

  const handleSubmit = (data: FlatLoadsheetFormData) => {
    submit(flatLoadsheetToLoadsheet(data));
  };

  const onConfirm = (value: boolean) => setConfirmed({ ...confirmed, [step]: value });

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Loadsheet" action={action[step]} />
      </ModalHeader>
      <ModalBody>
        <FormDensityProvider density="compact">
          <Form<FlatLoadsheetFormData>
            id={formId}
            initialValues={initialValues ?? loadsheetToFlatLoadsheet(loadsheet)}
            validationSchema={updatePreliminaryLoadsheetSchema}
            onSubmit={handleSubmit}
            innerRef={formik}
          >
            <div className="flex flex-col gap-5">
              <fieldset disabled={locked} className="contents">
                {step === "load" && <LoadsheetLoadStep serviceType={serviceType} capacity={capacity} />}
                {step === "fuel" && <LoadsheetFuelStep timesheet={timesheet} />}
                {step === "notoc" && notoc}
              </fieldset>

              {requiresConfirmation && (
                <CrosscheckConfirmation id={`${formId}-${step}`} confirmed={confirmed[step]} onConfirm={onConfirm} />
              )}
            </div>
          </Form>
        </FormDensityProvider>
      </ModalBody>
      <ModalActions
        key={step}
        note={`Step ${index + 1} of ${steps.length}`}
        cancel={
          index === 0
            ? { label: "Back", onClick: cancel }
            : { label: "Back", onClick: () => setStep(steps[index - 1]), animateExit: false }
        }
        confirm={{
          label: isLast ? confirmLabel : "Continue",
          disabled: !canContinue,
          onClick: () => (isLast ? formik.current?.submitForm() : advance()),
          trailing: isLast ? confirmTrailing : undefined,
        }}
      />
    </Modal>
  );
}

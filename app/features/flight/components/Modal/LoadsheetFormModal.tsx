import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import type { FormikProps } from "formik";
import React, { useRef, useState } from "react";
import type { Loadsheet } from "~/features/flight";
import { LoadsheetFuelStep } from "~/features/flight/components/Forms/LoadsheetFuelStep";
import { LoadsheetLoadStep } from "~/features/flight/components/Forms/LoadsheetLoadStep";
import { FUEL_STEP_FIELDS } from "~/features/flight/components/Forms/loadsheetFields";
import {
  type FlatLoadsheetFormData,
  flatLoadsheetToLoadsheet,
  loadsheetToFlatLoadsheet,
} from "~/features/flight/form-types";
import { updatePreliminaryLoadsheetSchema } from "~/features/flight/schema";
import { Form } from "~/shared/ui/Form/Form";
import { FormDensityProvider } from "~/shared/ui/Form/formDensity";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type StepTitles = {
  fuel: string;
  weights: string;
};

type Props = {
  action: StepTitles;
  formId: string;
  loadsheet: Loadsheet;
  confirmLabel: string;
  confirmTrailing?: React.ReactNode;
  submit: (loadsheet: Loadsheet) => void;
  cancel: () => void;
};

type Step = "fuel" | "load";

function touchedFields(fields: string[]): Record<string, boolean> {
  return Object.fromEntries(fields.map((field) => [field, true]));
}

export function LoadsheetFormModal({
  action,
  formId,
  loadsheet,
  confirmLabel,
  confirmTrailing,
  submit,
  cancel,
}: Props) {
  const [step, setStep] = useState<Step>("fuel");
  const formik = useRef<FormikProps<FlatLoadsheetFormData>>(null);

  const goToLoad = async () => {
    const form = formik.current;

    if (!form) {
      return;
    }

    const errors = await form.validateForm();
    form.setTouched({ ...form.touched, ...touchedFields(FUEL_STEP_FIELDS) });

    if (!FUEL_STEP_FIELDS.some((field) => field in errors)) {
      setStep("load");
    }
  };

  const handleSubmit = (data: FlatLoadsheetFormData) => {
    if (step === "fuel") {
      goToLoad();
      return;
    }

    submit(flatLoadsheetToLoadsheet(data));
  };

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Loadsheet" action={step === "fuel" ? action.fuel : action.weights} />
      </ModalHeader>
      <ModalBody>
        <FormDensityProvider density="compact">
          <Form<FlatLoadsheetFormData>
            id={formId}
            initialValues={loadsheetToFlatLoadsheet(loadsheet)}
            validationSchema={updatePreliminaryLoadsheetSchema}
            onSubmit={handleSubmit}
            innerRef={formik}
          >
            {step === "fuel" ? <LoadsheetFuelStep /> : <LoadsheetLoadStep />}
          </Form>
        </FormDensityProvider>
      </ModalBody>
      {step === "fuel" ? (
        <ModalActions
          key="fuel"
          note="Step 1 of 2"
          cancel={{ label: "Back", onClick: cancel }}
          confirm={{ label: "Confirm fuel and continue", onClick: goToLoad }}
        />
      ) : (
        <ModalActions
          key="load"
          note="Step 2 of 2"
          cancel={{ label: "Back", onClick: () => setStep("fuel"), animateExit: false }}
          confirm={{ label: confirmLabel, onClick: () => formik.current?.submitForm(), trailing: confirmTrailing }}
        />
      )}
    </Modal>
  );
}

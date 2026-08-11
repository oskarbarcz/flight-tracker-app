import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers, type FormikValues } from "formik";
import React from "react";
import type { ObjectSchema } from "yup";
import { FormDensityProvider } from "~/shared/ui/Form/formDensity";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props<T extends FormikValues> = {
  context: string;
  title: string;
  submitLabel: string;
  initialValues: T;
  validationSchema: ObjectSchema<T>;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => Promise<void>;
  close: () => void;
  size?: React.ComponentProps<typeof Modal>["size"];
  children: React.ReactNode;
};

export function FormModal<T extends FormikValues>({
  context,
  title,
  submitLabel,
  initialValues,
  validationSchema,
  onSubmit,
  close,
  size = "2xl",
  children,
}: Props<T>) {
  return (
    <Modal size={size} show onClose={close}>
      <ModalHeader>
        <ModalTitle context={context} action={title} />
      </ModalHeader>
      <Formik<T>
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <FormikForm noValidate className="flex min-h-0 flex-1 flex-col">
            <ModalBody>
              <FormDensityProvider density="compact">{children}</FormDensityProvider>
            </ModalBody>
            <ModalActions
              cancel={{ onClick: close }}
              confirm={{ label: submitLabel, type: "submit" }}
              pending={isSubmitting}
              pendingLabel="Saving…"
            />
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
}

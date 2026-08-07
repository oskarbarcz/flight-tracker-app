import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers, type FormikValues } from "formik";
import React from "react";
import type { ObjectSchema } from "yup";
import { FormDensityProvider } from "~/shared/ui/Form/formDensity";

type Props<T extends FormikValues> = {
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
      <ModalHeader>{title}</ModalHeader>
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
            <ModalFooter>
              <div className="ms-auto flex gap-2">
                <Button color="gray" outline onClick={close} disabled={isSubmitting} className="cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" color="indigo" disabled={isSubmitting} className="cursor-pointer">
                  {submitLabel}
                </Button>
              </div>
            </ModalFooter>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );
}

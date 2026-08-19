import { Form, Formik } from "formik";
import React, { useState } from "react";
import type { ObjectSchema } from "yup";
import { FormSectionHeader } from "~/shared/ui/Form/Partial/FormSectionHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props<T extends object> = {
  initialValues: T;
  validationSchema?: ObjectSchema<T>;
  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;
  onSubmit: (data: T) => void;
  title: string;
  children: React.ReactNode;
};

export function FormSection<T extends object>({
  initialValues,
  validationSchema,
  isEditable,
  setIsEditable,
  title,
  onSubmit,
  children,
}: Props<T>) {
  const [showSavedInfo, setShowSavedInfo] = useState<boolean>(false);

  const handleSubmit = (values: T) => {
    setIsEditable(false);
    onSubmit(values);

    setShowSavedInfo(true);
    setTimeout(() => setShowSavedInfo(false), 3000);
  };

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
        validationSchema={validationSchema}
      >
        <Form className="flex flex-col gap-4">
          <FormSectionHeader
            title={title}
            edit={isEditable}
            setEdit={setIsEditable}
            showSaveConfirmation={showSavedInfo}
          />
          {children}
        </Form>
      </Formik>
    </Container>
  );
}

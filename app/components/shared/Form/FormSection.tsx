"use client";

import React, { useState } from "react";
import Container from "~/components/shared/Layout/Container";
import FormSectionHeader from "~/components/shared/Form/Partial/FormSectionHeader";
import { Formik, Form } from "formik";
import { ObjectSchema } from "yup";

type FormSectionProps<T extends object> = {
  initialValues: T;
  validationSchema?: ObjectSchema<T>;
  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;
  onSubmit: (data: T) => void;
  title: string;
  children: React.ReactNode;
};

export default function FormSection<T extends object>({
  initialValues,
  validationSchema,
  isEditable,
  setIsEditable,
  title,
  onSubmit,
  children,
}: FormSectionProps<T>) {
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
        <Form>
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

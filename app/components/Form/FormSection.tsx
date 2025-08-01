"use client";

import React, { useState } from "react";
import Container from "~/components/Container";
import FormSectionHeader from "~/components/Form/Partial/FormSectionHeader";
import { Formik, Form } from "formik";

type FormSectionProps<T extends object> = {
  initialValues: T;
  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;
  onSubmit: (data: T) => void;
  title: string;
  children: React.ReactNode;
};

export default function FormSection<T extends object>({
  initialValues,
  title,
  onSubmit,
  children,
}: FormSectionProps<T>) {
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [showSavedInfo, setShowSavedInfo] = useState<boolean>(false);

  const handleSubmit = (values: T) => {
    setIsEditable(false);
    onSubmit(values);

    setShowSavedInfo(true);
    setTimeout(() => setShowSavedInfo(false), 3000);
  };

  return (
    <Container>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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

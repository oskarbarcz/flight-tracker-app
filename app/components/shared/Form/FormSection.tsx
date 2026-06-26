import { Form, Formik } from "formik";
import React, { useState } from "react";
import type { IconType } from "react-icons";
import type { ObjectSchema } from "yup";
import { FormSectionHeader } from "~/components/shared/Form/Partial/FormSectionHeader";
import { Container } from "~/components/shared/Layout/Container";

type Props<T extends object> = {
  initialValues: T;
  validationSchema?: ObjectSchema<T>;
  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;
  onSubmit: (data: T) => void;
  icon: IconType;
  title: string;
  children: React.ReactNode;
};

export function FormSection<T extends object>({
  initialValues,
  validationSchema,
  isEditable,
  setIsEditable,
  icon,
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
            icon={icon}
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

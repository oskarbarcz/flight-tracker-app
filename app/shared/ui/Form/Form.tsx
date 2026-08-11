import { Formik, Form as FormikForm, type FormikProps } from "formik";
import React from "react";
import type { ObjectSchema } from "yup";

type Props<T extends object> = {
  id?: string;
  initialValues: T;
  validationSchema?: ObjectSchema<T>;
  onSubmit: (data: T) => void;
  innerRef?: React.Ref<FormikProps<T>>;
  children: React.ReactNode;
};

export function Form<T extends object>({
  id,
  initialValues,
  validationSchema,
  onSubmit,
  innerRef,
  children,
}: Props<T>) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      validationSchema={validationSchema}
      validateOnChange
      validateOnBlur
      innerRef={innerRef}
    >
      <FormikForm id={id} noValidate>
        {children}
      </FormikForm>
    </Formik>
  );
}

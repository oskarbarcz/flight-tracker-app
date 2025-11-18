"use client";

import React from "react";
import { Formik, Form as FormikForm } from "formik";
import { ObjectSchema } from "yup";

type FormProps<T extends object> = {
  id?: string;
  initialValues: T;
  validationSchema?: ObjectSchema<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
};

export default function Form<T extends object>({
  id,
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: FormProps<T>) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      validationSchema={validationSchema}
      validateOnChange
      validateOnBlur
    >
      <FormikForm id={id} noValidate>
        {children}
      </FormikForm>
    </Formik>
  );
}

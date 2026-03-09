"use client";

import { Formik, Form as FormikForm } from "formik";
import React from "react";
import type { ObjectSchema } from "yup";

type Props<T extends object> = {
  id?: string;
  initialValues: T;
  validationSchema?: ObjectSchema<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
};

export function Form<T extends object>({ id, initialValues, validationSchema, onSubmit, children }: Props<T>) {
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

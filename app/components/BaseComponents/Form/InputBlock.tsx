"use client";

import { Label, TextInput } from "flowbite-react";
import React from "react";
import InputErrorList from "~/components/BaseComponents/Form/Partial/InputErrorList";

type InputProps = {
  htmlName: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  errors?: string[];
};

export default function InputBlock({
  htmlName,
  label,
  required,
  defaultValue,
  errors = [],
}: InputProps) {
  return (
    <div>
      <div className="mb-2 block">
        <Label
          htmlFor={htmlName}
          value={label}
          color={errors.length ? "failure" : undefined}
        />
      </div>
      <TextInput
        id={htmlName}
        name={htmlName}
        defaultValue={defaultValue}
        required={required}
        color={errors.length ? "failure" : undefined}
      />
      <InputErrorList errors={errors} />
    </div>
  );
}

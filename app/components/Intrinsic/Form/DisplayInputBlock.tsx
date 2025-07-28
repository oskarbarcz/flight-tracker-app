"use client";

import React from "react";
import ManagedInputBlock from "~/components/Intrinsic/Form/ManagedInputBlock";
import { Label, TextInput } from "flowbite-react";

type DisplayInputBlock = {
  htmlName: string;
  label: string;
  required?: boolean;
  value: string;
  setValue: (value: string) => void;
  errors?: string[];
  isEditable?: boolean;
};

export default function DisplayInputBlock({
  htmlName,
  label,
  required,
  value,
  setValue,
  errors = [],
  isEditable = true,
}: DisplayInputBlock) {
  if (!isEditable) {
    return (
      <div className="mb-4 block w-full">
        <Label className="mb-2" htmlFor={htmlName}>
          {label}
        </Label>
        <TextInput
          className="block mt-2"
          name={htmlName}
          value={value}
          disabled
        />
      </div>
    );
  }

  return (
    <ManagedInputBlock
      htmlName={htmlName}
      label={label}
      required={required}
      value={value}
      setValue={setValue}
      errors={errors}
    />
  );
}

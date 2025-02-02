"use client";

import { Label, TextInput } from "flowbite-react";
import React from "react";

type InputProps = {
  htmlName: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
};

export default function InputBlock({
  htmlName,
  label,
  required,
  defaultValue,
}: InputProps) {
  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor={htmlName} value={label} />
      </div>
      <TextInput
        id={htmlName}
        name={htmlName}
        defaultValue={defaultValue}
        required={required}
      />
    </div>
  );
}

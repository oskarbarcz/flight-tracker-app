"use client";

import { Badge, HelperText, Label, TextInput } from "flowbite-react";
import React from "react";

type InputProps = {
  htmlName: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  errors?: string[];
};

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
      {errors.length > 0 && (
        <HelperText color="failure">
          {errors.map((error, index) => (
            <span key={index} className="block">
              <Badge
                className="mb-1 me-2 inline-block uppercase"
                color="failure"
              >
                Error
              </Badge>
              {capitalizeFirstLetter(error)}
            </span>
          ))}
        </HelperText>
      )}
    </div>
  );
}

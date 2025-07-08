"use client";

import { Label, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import InputErrorList from "~/components/Intrinsic/Form/Partial/InputErrorList";

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
  const [isMarkedRed, setisMarkedRed] = useState<boolean>(false);

  useEffect(() => {
    setisMarkedRed(errors.length > 0);
  }, [errors]);

  return (
    <div>
      <div className="mb-2 block">
        <Label
          htmlFor={htmlName}
          color={isMarkedRed ? "failure" : undefined}>
          {label}
        </Label>
      </div>
      <TextInput
        id={htmlName}
        name={htmlName}
        defaultValue={defaultValue}
        required={required}
        onChange={() => {
          setisMarkedRed(false);
        }}
        color={isMarkedRed ? "failure" : undefined}
      />
      <InputErrorList errorFocus={isMarkedRed} errors={errors} />
    </div>
  );
}

"use client";

import { Label, TextInput } from "flowbite-react";
import React, { HTMLInputTypeAttribute, useEffect, useState } from "react";
import InputErrorList from "~/components/Intrinsic/Form/Partial/InputErrorList";

type ManagedInputBlockProps = {
  htmlName: string;
  label: string;
  required?: boolean;
  value: string;
  setValue: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  errors?: string[];
};

export default function ManagedInputBlock({
  htmlName,
  label,
  required,
  type = "text",
  value,
  setValue,
  errors = [],
}: ManagedInputBlockProps) {
  const [isMarkedRed, setisMarkedRed] = useState<boolean>(false);

  useEffect(() => {
    setisMarkedRed(errors.length > 0);
  }, [errors]);

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 block">
        <Label htmlFor={htmlName} color={isMarkedRed ? "failure" : undefined}>
          {label}
        </Label>
      </div>
      <TextInput
        id={htmlName}
        type={type}
        name={htmlName}
        value={value}
        required={required}
        onChange={(e) => {
          setisMarkedRed(false);
          setValue(e.target.value);
        }}
        color={isMarkedRed ? "failure" : undefined}
      />
      <InputErrorList errorFocus={isMarkedRed} errors={errors} />
    </div>
  );
}

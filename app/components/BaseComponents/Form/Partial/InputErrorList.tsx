import { Badge, HelperText } from "flowbite-react";
import React from "react";

type InputErrorListProps = {
  errorFocus: boolean;
  errors: string[];
};

export default function InputErrorList({
  errorFocus,
  errors,
}: InputErrorListProps) {
  if (errors.length === 0) {
    return;
  }

  return (
    <HelperText color={errorFocus ? "failure" : undefined}>
      {!errorFocus && (
        <span className="mb-2 block">Previous field errors:</span>
      )}

      {errors.map((error, index) => (
        <span key={index} className="block">
          <Badge
            className="mb-1 me-2 inline-block uppercase"
            color={errorFocus ? "failure" : "gray"}
          >
            Error
          </Badge>
          {error}
        </span>
      ))}
    </HelperText>
  );
}

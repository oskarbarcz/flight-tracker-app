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
    <HelperText color={errorFocus ? "red" : undefined}>
      {errors.map((error, _index) => (
        <span key={error} className="block">
          <Badge
            className="mb-1 me-2 inline-block uppercase"
            color={errorFocus ? "failure" : "gray"}
          >
            !
          </Badge>
          <span className={errorFocus ? "text-red-500" : "text-gray-500"}>
            {error}
          </span>
        </span>
      ))}
    </HelperText>
  );
}

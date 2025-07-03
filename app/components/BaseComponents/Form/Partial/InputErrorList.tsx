import { Badge, HelperText } from "flowbite-react";
import React from "react";

type InputErrorListProps = {
  errors: string[];
};

export default function InputErrorList({ errors }: InputErrorListProps) {
  if (errors.length === 0) {
    return;
  }

  return (
    <HelperText color="failure">
      {errors.map((error, index) => (
        <span key={index} className="block">
          <Badge className="mb-1 me-2 inline-block uppercase" color="failure">
            Error
          </Badge>
          {error}
        </span>
      ))}
    </HelperText>
  );
}

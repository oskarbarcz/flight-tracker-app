import { Badge, HelperText } from "flowbite-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  id?: string;
  errorFocus: boolean;
  errors: string[];
  size?: "sm" | "md";
};

export function InputErrorList({ id, errorFocus, errors, size = "md" }: Props) {
  if (errors.length === 0) {
    return;
  }

  const isSmall = size === "sm";

  return (
    <HelperText
      id={id}
      className={isSmall ? "mt-1 text-2xs leading-snug" : undefined}
      color={errorFocus ? "red" : undefined}
    >
      {errors.map((error, _index) => (
        <span key={error} className="block">
          <Badge
            aria-hidden
            className={twMerge("mb-1 me-2 inline-block uppercase", isSmall && "px-1.5 py-0 text-2xs")}
            color={errorFocus ? "failure" : "gray"}
          >
            !
          </Badge>
          <span className={errorFocus ? "text-red-700 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}>
            {error}
          </span>
        </span>
      ))}
    </HelperText>
  );
}

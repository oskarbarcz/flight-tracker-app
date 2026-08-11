import { Badge, HelperText } from "flowbite-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  errorFocus: boolean;
  errors: string[];
  size?: "sm" | "md";
};

export function InputErrorList({ errorFocus, errors, size = "md" }: Props) {
  if (errors.length === 0) {
    return;
  }

  const isSmall = size === "sm";

  return (
    <HelperText
      className={isSmall ? "mt-1 text-[11px] leading-snug" : undefined}
      color={errorFocus ? "red" : undefined}
    >
      {errors.map((error, _index) => (
        <span key={error} className="block">
          <Badge
            className={twMerge("mb-1 me-2 inline-block uppercase", isSmall && "px-1.5 py-0 text-[11px]")}
            color={errorFocus ? "failure" : "gray"}
          >
            !
          </Badge>
          <span className={errorFocus ? "text-red-500" : "text-gray-500"}>{error}</span>
        </span>
      ))}
    </HelperText>
  );
}

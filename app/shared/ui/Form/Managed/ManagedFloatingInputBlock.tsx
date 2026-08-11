import { FloatingLabel, HelperText } from "flowbite-react";
import { useField } from "formik";
import React, {
  type ChangeEvent,
  type FocusEvent,
  type HTMLInputAutoCompleteAttribute,
  type HTMLInputTypeAttribute,
  type ReactNode,
  useState,
} from "react";
import { FaInfoCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { useFormDensity } from "~/shared/ui/Form/formDensity";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";

type ManagedFloatingInputBlock = {
  field: string;
  label: string;
  required?: boolean;
  helperText?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  disabled?: boolean;
  className?: string;
  unit?: string;
  decimals?: number;
  footnote?: string;
  errors?: string[];
};

const hideSpinnerClasses =
  "[&_input]:[appearance:textfield] [&_input::-webkit-outer-spin-button]:appearance-none [&_input::-webkit-inner-spin-button]:appearance-none [&_input::-webkit-inner-spin-button]:m-0";

const numericFontClasses = "[&_input]:font-mono [&_input]:tabular-nums";

function unitPaddingClass(unit: string): string {
  if (unit.length <= 2) {
    return "[&_input]:pe-9";
  }

  return unit.length <= 5 ? "[&_input]:pe-11" : "[&_input]:pe-24";
}

function unitPlacementClass(unit: string, sizing: "sm" | "md"): string {
  const baseline = sizing === "sm" ? "bottom-2" : "bottom-2.5";
  const inset = unit.length <= 2 ? "right-3" : "right-2";

  return `${baseline} ${inset}`;
}

function withDecimals(value: unknown, decimals: number): string {
  const parsed = Number(value);

  if (value === "" || value === null || value === undefined || !Number.isFinite(parsed)) {
    return "";
  }

  return parsed.toFixed(decimals);
}

export function ManagedFloatingInputBlock({
  field,
  label,
  required = true,
  autoComplete,
  type = "text",
  helperText,
  disabled = false,
  className = "",
  unit,
  decimals,
  footnote,
  errors = [],
}: ManagedFloatingInputBlock) {
  const [fieldProps, meta] = useField(field);
  const [draft, setDraft] = useState<string | null>(null);
  const clientError = meta.touched && meta.error ? [meta.error] : [];
  const displayedErrors = [...new Set([...clientError, ...errors])];
  const isError = displayedErrors.length > 0;
  const density = useFormDensity();

  const footnoteBlock = footnote ? (
    <div className="rounded-b-lg border border-t-0 border-gray-300 bg-gray-100 px-2 py-1 text-[11px] leading-tight text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
      {footnote}
    </div>
  ) : null;

  const labelContent: ReactNode = required ? (
    <>
      {label}
      <span className="text-red-500"> *</span>
    </>
  ) : (
    label
  );

  const inputProps =
    decimals === undefined
      ? fieldProps
      : {
          ...fieldProps,
          value: draft ?? withDecimals(fieldProps.value, decimals),
          onChange: (event: ChangeEvent<HTMLInputElement>) => {
            setDraft(event.target.value);
            fieldProps.onChange(event);
          },
          onBlur: (event: FocusEvent<HTMLInputElement>) => {
            setDraft(null);
            fieldProps.onBlur(event);
          },
        };

  return (
    <div className={twMerge("w-full", className)}>
      <div
        className={twMerge(
          "relative",
          type === "number" && numericFontClasses,
          unit && unitPaddingClass(unit),
          unit && hideSpinnerClasses,
          footnote && "[&_input]:rounded-b-none",
        )}
      >
        <FloatingLabel
          variant="outlined"
          label={labelContent as unknown as string}
          sizing={density.floatingSizing}
          autoComplete={autoComplete}
          type={type}
          required={required}
          className="whitespace-nowrap dark:bg-gray-800"
          color={isError ? "error" : undefined}
          disabled={disabled}
          {...inputProps}
        />
        {unit && (
          <span
            className={twMerge(
              "pointer-events-none absolute font-mono text-xs font-medium leading-5 text-gray-500 dark:text-gray-400",
              unitPlacementClass(unit, density.floatingSizing),
            )}
          >
            {unit}
          </span>
        )}
      </div>
      {footnoteBlock}
      <InputErrorList errorFocus={isError} errors={displayedErrors} size={density.floatingSizing} />
      {helperText && (
        <HelperText className="text-xs px-1 flex items-center gap-2">
          <FaInfoCircle />
          {helperText}
        </HelperText>
      )}
    </div>
  );
}

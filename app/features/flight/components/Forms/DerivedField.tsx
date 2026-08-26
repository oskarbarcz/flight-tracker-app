import { FloatingLabel } from "flowbite-react";
import React from "react";
import { useFormDensity } from "~/shared/ui/Form/formDensity";

type Props = {
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
  description?: React.ReactNode;
};

export function DerivedField({ label, value, unit = "tons", decimals = 2, description }: Props) {
  const density = useFormDensity();

  return (
    <div className="w-full">
      <div className={`relative w-full [&_input]:font-mono [&_input]:tabular-nums ${unit ? "[&_input]:pe-11" : ""}`}>
        <FloatingLabel
          variant="outlined"
          label={label}
          sizing={density.floatingSizing}
          value={value.toFixed(decimals)}
          readOnly
          disabled
          className="whitespace-nowrap dark:bg-gray-800"
        />
        {unit && (
          <span className="pointer-events-none absolute bottom-2.5 right-2 font-mono text-xs font-medium leading-5 text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
      {description && <div className="px-1 pt-1">{description}</div>}
    </div>
  );
}

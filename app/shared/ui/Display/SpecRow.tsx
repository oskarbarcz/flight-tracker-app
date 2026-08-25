import React from "react";

type Props = {
  label: string;
  value: string | null;
  suffix?: string | null;
};

const NOT_REPORTED = "Not reported";

export function SpecRow({ label, value, suffix = null }: Props) {
  return (
    <>
      <dt className="text-[10px] font-medium uppercase leading-4 tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="whitespace-nowrap text-right font-mono text-xs font-bold leading-4 tabular-nums text-gray-900 dark:text-gray-100">
        {value ?? NOT_REPORTED}
        {suffix !== null && (
          <span className="ml-1.5 font-normal text-gray-500 dark:text-gray-400">{`(${suffix})`}</span>
        )}
      </dd>
    </>
  );
}

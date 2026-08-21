import React from "react";

type Props = {
  label: string;
  value: React.ReactNode;
};

export function TooltipRow({ label, value }: Props) {
  return (
    <>
      <dt className="text-gray-400">{label}</dt>
      <dd className="whitespace-nowrap text-end text-white">{value}</dd>
    </>
  );
}

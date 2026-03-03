import React, { JSX } from "react";

type Props = {
  logoUrl: string;
};

export function OperatorLogo({ logoUrl }: Props): JSX.Element {
  return (
    <div className="size-20 lg:size-26 xl:size-32 rounded-xl bg-white border border-gray-200 p-2">
      <img src={logoUrl} alt="Operator logo" />
    </div>
  );
}

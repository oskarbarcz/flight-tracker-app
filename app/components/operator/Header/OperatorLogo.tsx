import React, { type JSX } from "react";

type Props = {
  logoUrl: string;
};

export function OperatorLogo({ logoUrl }: Props): JSX.Element {
  return (
    <div className="self-center size-36 md:size-20 lg:size-26 xl:size-32 rounded-xl bg-white border border-gray-200 dark:border-gray-700 p-4 xl:p-6 dark:brightness-75 dark:contrast-125">
      <img src={logoUrl} alt="Operator logo" />
    </div>
  );
}

import React from "react";

type Props = {
  children: React.ReactNode;
};

export function RecordValue({ children }: Props) {
  return <p className="break-all font-mono text-sm font-medium text-gray-900 dark:text-gray-100">{children}</p>;
}

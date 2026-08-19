import React from "react";

type Props = {
  children: React.ReactNode;
};

export function CardDescription({ children }: Props) {
  return <p className="-mb-1 text-xs text-gray-500 dark:text-gray-400">{children}</p>;
}

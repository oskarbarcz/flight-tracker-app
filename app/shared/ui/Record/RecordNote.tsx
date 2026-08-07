import React from "react";

type Props = {
  children: React.ReactNode;
};

export function RecordNote({ children }: Props) {
  return <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">{children}</p>;
}

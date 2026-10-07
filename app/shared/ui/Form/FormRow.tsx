import React from "react";

type Props = {
  children: React.ReactNode;
};

export function FormRow({ children }: Props) {
  return <div className="flex flex-col gap-4 sm:flex-row">{children}</div>;
}

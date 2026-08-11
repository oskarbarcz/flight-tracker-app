import React from "react";

type Props = {
  children: React.ReactNode;
};

export function FormRow({ children }: Props) {
  return <div className="flex gap-4">{children}</div>;
}

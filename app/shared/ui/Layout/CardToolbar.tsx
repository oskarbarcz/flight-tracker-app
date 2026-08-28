import React from "react";

type Props = {
  children: React.ReactNode;
};

export function CardToolbar({ children }: Props) {
  return <div className="mb-4 flex flex-wrap items-center justify-end gap-2">{children}</div>;
}

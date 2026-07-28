import React from "react";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function PilotRotationGroup({ title, children }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <FieldLabel>{title}</FieldLabel>
      {children}
    </section>
  );
}

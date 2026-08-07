import React from "react";
import { twMerge } from "tailwind-merge";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  label: string;
  action?: React.ReactNode;
  detail?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function RecordRow({ label, action, detail, className, children }: Props) {
  return (
    <div className={twMerge("border-t border-gray-200 px-5 py-5 dark:border-gray-800", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1 space-y-2">
          <h3>
            <FieldLabel className="tracking-[0.08em]">{label}</FieldLabel>
          </h3>
          {children}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {detail && <div className="mt-4">{detail}</div>}
    </div>
  );
}

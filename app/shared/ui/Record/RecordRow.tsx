import React from "react";
import { twMerge } from "tailwind-merge";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  label: string;
  action?: React.ReactNode;
  keepActionBeside?: boolean;
  detail?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export function RecordRow({ label, action, keepActionBeside = false, detail, className, children }: Props) {
  return (
    <div className={twMerge("border-t border-gray-200 px-5 py-5 dark:border-gray-800", className)}>
      <div
        className={twMerge(
          "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8",
          keepActionBeside && "flex-row items-start justify-between",
        )}
      >
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

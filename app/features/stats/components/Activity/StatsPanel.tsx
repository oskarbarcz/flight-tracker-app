import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode | ((detailed: boolean) => React.ReactNode);
  details?: React.ReactNode;
  detailsLabel?: string;
  hasDetails?: boolean;
  className?: string;
};

export function StatsPanel({ children, details, detailsLabel = "Details", hasDetails, className }: Props) {
  const [detailed, setDetailed] = useState(false);

  const offersDetails = hasDetails ?? details !== undefined;
  const body = typeof children === "function" ? children(detailed) : children;

  return (
    <div
      className={twMerge("flex flex-col rounded-xl border border-gray-200 px-3.5 py-3 dark:border-gray-700", className)}
    >
      {body}

      {offersDetails && (
        <>
          {detailed && details !== undefined && (
            <div className="mt-2 animate-in fade-in duration-200 motion-reduce:animate-none">{details}</div>
          )}

          <button
            type="button"
            aria-expanded={detailed}
            onClick={() => setDetailed(!detailed)}
            className="mt-2 w-full cursor-pointer rounded-lg py-1 text-center text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-indigo-300 dark:hover:bg-indigo-950"
          >
            {detailed ? "Less" : detailsLabel}
          </button>
        </>
      )}
    </div>
  );
}

import React from "react";
import { twMerge } from "tailwind-merge";

export type ContainerClassProps = {
  className?: string;
};

type Padding = "condensed" | "normal" | "spacious";

function paddingClass(padding: Padding): string {
  const options = {
    condensed: "pt-2 px-4 pb-4",
    normal: "pt-3 px-5 pb-5",
    spacious: "pt-4 px-6 pb-6",
  };
  return options[padding];
}

type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
  padding?: Padding;
};

export function Container({ children, className, padding = "normal" }: ContainerProps) {
  return (
    <section
      className={twMerge(
        "flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        className,
      )}
    >
      <div className="h-1 bg-linear-to-r from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-500" />
      <div className={twMerge("flex flex-1 flex-col gap-4", paddingClass(padding))}>{children}</div>
    </section>
  );
}

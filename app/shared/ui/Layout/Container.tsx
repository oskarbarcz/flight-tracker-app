import React from "react";
import { twMerge } from "tailwind-merge";

export type ContainerClassProps = {
  className?: string;
};

type Padding = "none" | "condensed" | "normal" | "spacious";

function paddingClass(padding: Padding): string {
  const options = {
    none: "p-0",
    condensed: "p-4",
    normal: "p-5",
    spacious: "p-6",
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
        "flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        paddingClass(padding),
        className,
      )}
    >
      {children}
    </section>
  );
}

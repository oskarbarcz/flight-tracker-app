import React from "react";
import { twMerge } from "tailwind-merge";

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

type TransparentContainerProps = {
  children?: React.ReactNode;
  className?: string;
  padding?: Padding;
  chromeless?: boolean;
};

export function TransparentContainer({
  children,
  className,
  padding = "none",
  chromeless = false,
}: TransparentContainerProps) {
  if (chromeless) {
    return <section className={twMerge(paddingClass(padding), className)}>{children}</section>;
  }

  return (
    <section
      className={twMerge(
        "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04),0_6px_16px_-8px_rgb(15_23_42/0.12)] dark:border-gray-800 dark:bg-gray-900 dark:shadow-none",
        paddingClass(padding),
        className,
      )}
    >
      {children}
    </section>
  );
}

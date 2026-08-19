import React from "react";
import { twMerge } from "tailwind-merge";

export type ContainerClassProps = {
  className?: string;
};

export type ContainerPadding = "none" | "condensed" | "normal" | "spacious";

export const ContainerPaddingContext = React.createContext<ContainerPadding>("normal");

function paddingClass(padding: ContainerPadding): string {
  const options = {
    none: "p-0",
    condensed: "px-3 py-2.5",
    normal: "px-3.5 py-3",
    spacious: "px-4 py-3.5",
  };
  return options[padding];
}

const SHELL =
  "flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900";

type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
  padding?: ContainerPadding;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export function Container({ children, className, padding = "normal", header, footer }: ContainerProps) {
  if (header === undefined && footer === undefined) {
    return (
      <ContainerPaddingContext.Provider value={padding}>
        <section className={twMerge(SHELL, "gap-3", paddingClass(padding), className)}>{children}</section>
      </ContainerPaddingContext.Provider>
    );
  }

  return (
    <ContainerPaddingContext.Provider value={padding}>
      <section className={twMerge(SHELL, className)}>
        {header}
        <div className={twMerge("flex min-w-0 flex-1 flex-col gap-3", paddingClass(padding))}>{children}</div>
        {footer !== undefined && <footer className="border-t border-gray-200 dark:border-gray-800">{footer}</footer>}
      </section>
    </ContainerPaddingContext.Provider>
  );
}

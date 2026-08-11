import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function BuildUpPanel({ title, children }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
      <header className="border-b border-gray-300 bg-gray-200 px-4 py-2 dark:border-gray-700 dark:bg-gray-900/80">
        <h3 className="text-base font-semibold leading-tight text-gray-900 dark:text-white">{title}</h3>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

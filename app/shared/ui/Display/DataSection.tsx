import React from "react";
import type { IconType } from "react-icons";

type Props = {
  icon: IconType;
  title: string;
  children: React.ReactNode;
};

export function DataSection({ icon: Icon, title, children }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-3.5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      {children}
    </section>
  );
}

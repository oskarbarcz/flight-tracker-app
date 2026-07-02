import React from "react";
import type { IconType } from "react-icons";

const colorMap = {
  indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950",
  green: "text-green-500 bg-green-100 dark:bg-green-950",
  orange: "text-orange-500 bg-orange-100 dark:bg-orange-950",
  blue: "text-blue-500 bg-blue-50 dark:bg-blue-950",
};

type Props = {
  icon: IconType;
  color: keyof typeof colorMap;
  title: string;
  children: React.ReactNode;
};

export function DataSection({ icon: Icon, color, title, children }: Props) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <div className={`size-6 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="size-3" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</h3>
      </div>
      {children}
    </section>
  );
}

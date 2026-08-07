import React from "react";
import { Link } from "react-router";

export type TabLinkItem = {
  key: string;
  title: string;
  to: string;
};

type Props = {
  label: string;
  items: TabLinkItem[];
  activeKey: string;
};

export function TabLinkNav({ label, items, activeKey }: Props) {
  return (
    <nav
      aria-label={label}
      className="flex flex-nowrap overflow-x-auto overflow-y-hidden border-b border-gray-200 dark:border-gray-700"
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Link
            key={item.key}
            to={item.to}
            viewTransition
            preventScrollReset
            aria-current={isActive ? "page" : undefined}
            className={`-mb-px shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

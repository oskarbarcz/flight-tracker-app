import React from "react";
import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

export type Crumb = {
  label: string;
  to?: string;
  mono?: boolean;
};

type Props = {
  items: Crumb[];
  className?: string;
};

export function Breadcrumbs({ items, className }: Props) {
  return (
    <nav aria-label="Breadcrumb" className={twMerge("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {items.map((crumb, index) => {
          const isCurrent = index === items.length - 1;
          const label = <span className={crumb.mono ? "font-mono" : undefined}>{crumb.label}</span>;

          return (
            <li key={crumb.label} className="flex min-w-0 items-center gap-x-1.5">
              {index > 0 && (
                <HiChevronRight aria-hidden={true} className="size-4 shrink-0 text-gray-400 dark:text-gray-600" />
              )}
              {crumb.to && !isCurrent ? (
                <Link
                  to={crumb.to}
                  viewTransition
                  className="truncate text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  {label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className="truncate font-semibold text-gray-900 dark:text-white"
                >
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

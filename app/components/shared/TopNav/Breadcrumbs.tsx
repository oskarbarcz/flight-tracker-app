import React, { Fragment, type ReactNode } from "react";
import { Link } from "react-router";

export type BreadcrumbItem = {
  label: ReactNode;
  to?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: Props) {
  return (
    <ol className="flex items-center gap-2 text-sm min-w-0">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: breadcrumbs are positional and never reordered
          <Fragment key={index}>
            <li className="truncate">
              {item.to && !isLast ? (
                <Link to={item.to} viewTransition className="text-gray-500 hover:text-indigo-500 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">{item.label}</span>
              )}
            </li>
            {!isLast && (
              <li aria-hidden className="text-gray-400 dark:text-gray-600 select-none">
                /
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}

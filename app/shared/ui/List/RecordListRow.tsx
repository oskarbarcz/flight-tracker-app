import React from "react";
import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router";
import type { RecordListLayout } from "~/shared/ui/List/recordListLayout";

type Props = {
  layout: RecordListLayout;
  href: string;
  label: string;
  trailing: React.ReactNode;
  children: React.ReactNode;
};

export function RecordListRow({ layout, href, label, trailing, children }: Props) {
  return (
    <li className="border-b border-gray-200 last:border-b-0 dark:border-gray-800">
      <div
        className={`${layout.grid} relative items-center bg-white transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/60`}
      >
        <Link to={href} viewTransition aria-label={label} className="absolute inset-0 z-0" />
        {children}
        <HiChevronRight
          className={`${layout.chevronClassName} size-4 shrink-0 text-gray-400 dark:text-gray-500`}
          aria-hidden
        />
        <span className={layout.trailingClassName}>{trailing}</span>
      </div>
    </li>
  );
}

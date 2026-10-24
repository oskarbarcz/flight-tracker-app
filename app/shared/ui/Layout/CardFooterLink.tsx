import React from "react";
import type { IconType } from "react-icons";
import { FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router";

type Props = {
  to: string;
  icon: IconType;
  title: string;
  description: string;
};

export function CardFooterLink({ to, icon: Icon, title, description }: Props) {
  return (
    <Link
      to={to}
      viewTransition
      className="group flex items-center gap-3 rounded-b-[calc(var(--radius-2xl)-1px)] px-3 py-2.5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:hover:bg-gray-800/50 dark:focus-visible:ring-indigo-400"
    >
      <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-indigo-900 dark:group-hover:text-indigo-300">
        <Icon size={14} aria-hidden={true} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
        <span className="block text-xs text-gray-500 dark:text-gray-400">{description}</span>
      </span>
      <FaChevronRight
        size={13}
        className="ms-auto flex-none text-gray-500 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500 motion-reduce:transition-none dark:text-gray-400"
        aria-hidden={true}
      />
    </Link>
  );
}

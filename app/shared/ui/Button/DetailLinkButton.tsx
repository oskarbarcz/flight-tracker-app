import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";

type Props = {
  to: string;
  children: React.ReactNode;
};

export function DetailLinkButton({ to, children }: Props) {
  return (
    <Link
      to={to}
      viewTransition
      className="group inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 dark:focus-visible:ring-indigo-700"
    >
      {children}
      <FaArrowRight
        size={12}
        aria-hidden={true}
        className="text-gray-400 transition-[color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:text-indigo-500 motion-reduce:transform-none dark:text-gray-500"
      />
    </Link>
  );
}

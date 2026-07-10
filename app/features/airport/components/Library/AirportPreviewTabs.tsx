import React from "react";
import { Link, useLocation } from "react-router";
import { airportPreviewTabs, pathForTab, resolveActiveTab } from "~/features/airport/components/Library/previewTabs";

type Props = {
  airportId: string;
};

export function AirportPreviewTabs({ airportId }: Props) {
  const { pathname } = useLocation();
  const activeTab = resolveActiveTab(pathname, airportId);

  return (
    <div role="tablist" className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700">
      {airportPreviewTabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Link
            key={tab.key || "details"}
            to={pathForTab(airportId, tab)}
            viewTransition
            preventScrollReset
            role="tab"
            aria-selected={isActive}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {tab.title}
          </Link>
        );
      })}
    </div>
  );
}

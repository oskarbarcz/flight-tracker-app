import React, { useEffect, useRef } from "react";
import { Link } from "react-router";

export type TabLinkItem = {
  key: string;
  title: string;
  to: string;
  count?: number;
};

type Props = {
  label: string;
  items: TabLinkItem[];
  activeKey: string;
};

export function TabLinkNav({ label, items, activeKey }: Props) {
  const tablistRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const tablist = tablistRef.current;
    const activeTab = tablist?.querySelector<HTMLElement>(`[data-tab-key="${CSS.escape(activeKey)}"]`);
    if (!tablist || !activeTab) return;

    tablist.scrollLeft = Math.max(0, activeTab.offsetLeft - (tablist.clientWidth - activeTab.clientWidth) / 2);
  }, [activeKey]);

  return (
    <nav
      ref={tablistRef}
      aria-label={label}
      className="flex flex-nowrap overflow-x-auto overflow-y-hidden border-b border-gray-200 dark:border-gray-700"
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Link
            key={item.key}
            data-tab-key={item.key}
            to={item.to}
            viewTransition
            preventScrollReset
            aria-current={isActive ? "page" : undefined}
            className={`-mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {item.title}
            {item.count !== undefined && item.count > 0 && <TabCount count={item.count} isActive={isActive} />}
          </Link>
        );
      })}
    </nav>
  );
}

function TabCount({ count, isActive }: { count: number; isActive: boolean }) {
  return (
    <span
      className={`min-w-5 rounded-full px-1.5 py-0.5 text-center font-mono text-[11px] font-bold tabular-nums ${
        isActive
          ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white"
          : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
      }`}
    >
      {count}
    </span>
  );
}

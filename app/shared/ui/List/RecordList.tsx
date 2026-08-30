import { Pagination, Spinner } from "flowbite-react";
import React from "react";
import { RecordListHeader } from "~/shared/ui/List/RecordListHeader";
import type { RecordListLayout } from "~/shared/ui/List/recordListLayout";

type Props = {
  layout: RecordListLayout;
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  children: React.ReactNode;
};

export function RecordList({ layout, loading, page, totalPages, onPageChange, children }: Props) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] dark:bg-gray-900/50">
          <Spinner color="indigo" size="xl" />
        </div>
      )}

      <RecordListHeader layout={layout} />

      <ul>{children}</ul>

      {totalPages > 1 && (
        <div className="flex justify-center overflow-x-auto bg-gray-50 pt-2 pb-4 dark:bg-gray-800">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} showIcons />
        </div>
      )}
    </div>
  );
}

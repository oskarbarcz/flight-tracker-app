import type { RecordListLayout } from "~/shared/ui/List/recordListLayout";

export const airportListLayout: RecordListLayout = {
  grid: "grid grid-cols-[104px_1fr_18px] sm:grid-cols-[150px_1fr_auto_34px]",
  headers: ["Airport", "Name and location"],
  trailingHeader: "Enrichment",
  trailingClassName: "order-5 col-span-3 sm:order-4 sm:col-span-1",
  chevronClassName: "order-4 sm:order-5",
  headerTrailingClassName: "order-4 hidden sm:block",
};

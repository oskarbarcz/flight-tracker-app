import type { RecordListLayout } from "~/shared/ui/List/recordListLayout";

export const airportListLayout: RecordListLayout = {
  grid: "grid grid-cols-[104px_1fr_18px] @xl:grid-cols-[150px_1fr_auto_34px]",
  headers: ["Airport", "Name and location"],
  trailingHeader: "Enrichment",
  trailingClassName: "order-5 col-span-3 @xl:order-4 @xl:col-span-1",
  chevronClassName: "order-4 @xl:order-5",
  headerTrailingClassName: "order-4 hidden @xl:block",
};

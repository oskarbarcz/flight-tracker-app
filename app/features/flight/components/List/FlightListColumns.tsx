import React, { type ReactNode } from "react";
import type { Flight } from "~/features/flight";
import { blockTimeLabelOf, FlightBlockTimeCell } from "~/features/flight/components/List/Cell/FlightBlockTimeCell";
import { FlightStatusCell, statusLabelOf } from "~/features/flight/components/List/Cell/FlightStatusCell";
import type { RecordListLayout } from "~/shared/ui/List/recordListLayout";

export type FlightListTrailingColumn = {
  layout: RecordListLayout;
  render: (flight: Flight) => ReactNode;
  label: (flight: Flight) => string;
};

const HEADERS = ["Date", "Flight", "Route"];

export const blockTimeColumn: FlightListTrailingColumn = {
  layout: {
    grid: "grid grid-cols-[96px_100px_1fr_18px] @xl:grid-cols-[124px_150px_minmax(160px,300px)_1fr_34px]",
    headers: HEADERS,
    trailingHeader: "Block",
    trailingClassName: "order-4 hidden @xl:block",
    chevronClassName: "order-5",
    headerTrailingClassName: "order-4 hidden @xl:block",
  },
  render: (flight) => <FlightBlockTimeCell flight={flight} />,
  label: blockTimeLabelOf,
};

export const statusColumn: FlightListTrailingColumn = {
  layout: {
    grid: "grid grid-cols-[96px_100px_1fr_18px] @xl:grid-cols-[124px_150px_minmax(160px,300px)_1fr_34px]",
    headers: HEADERS,
    trailingHeader: "Status",
    trailingClassName: "order-5 col-span-4 @xl:order-4 @xl:col-span-1",
    chevronClassName: "order-4 @xl:order-5",
    headerTrailingClassName: "order-4 hidden @xl:block",
  },
  render: (flight) => <FlightStatusCell flight={flight} />,
  label: statusLabelOf,
};

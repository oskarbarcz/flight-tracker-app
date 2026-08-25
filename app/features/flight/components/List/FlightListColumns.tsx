import React, { type ReactNode } from "react";
import type { Flight } from "~/features/flight";
import { blockTimeLabelOf, FlightBlockTimeCell } from "~/features/flight/components/List/Cell/FlightBlockTimeCell";
import { FlightStatusCell, statusLabelOf } from "~/features/flight/components/List/Cell/FlightStatusCell";

export type FlightListTrailingColumn = {
  header: string;
  render: (flight: Flight) => ReactNode;
  label: (flight: Flight) => string;
  grid: string;
  trailingClassName: string;
  chevronClassName: string;
  headerTrailingClassName: string;
};

export const blockTimeColumn: FlightListTrailingColumn = {
  header: "Block",
  render: (flight) => <FlightBlockTimeCell flight={flight} />,
  label: blockTimeLabelOf,
  grid: "grid grid-cols-[94px_68px_auto_1fr_18px] sm:grid-cols-[124px_150px_minmax(160px,300px)_1fr_34px]",
  trailingClassName: "order-4",
  chevronClassName: "order-5",
  headerTrailingClassName: "order-4",
};

export const statusColumn: FlightListTrailingColumn = {
  header: "Status",
  render: (flight) => <FlightStatusCell flight={flight} />,
  label: statusLabelOf,
  grid: "grid grid-cols-[94px_68px_1fr_18px] sm:grid-cols-[124px_150px_minmax(160px,300px)_1fr_34px]",
  trailingClassName: "order-5 col-span-4 sm:order-4 sm:col-span-1",
  chevronClassName: "order-4 sm:order-5",
  headerTrailingClassName: "order-4 hidden sm:block",
};

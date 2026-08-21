import { Badge, Spinner } from "flowbite-react";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { RefreshCabinButton } from "~/features/cabin-layout/components/Catalogue/RefreshCabinButton";
import { SeatMap } from "~/features/cabin-layout/components/SeatMap/SeatMap";
import type { CabinLayout, CabinSeatMap } from "~/features/cabin-layout/model";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { dateToIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { DataField } from "~/shared/ui/Display/DataField";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { Breadcrumbs } from "~/shared/ui/Section/Breadcrumbs";

type LayoutState = { status: "loading" } | { status: "missing" } | { status: "ready"; layout: CabinLayout };

type CabinState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "unavailable" }
  | { status: "ready"; seatMap: CabinSeatMap };

const PROVIDER_UNAVAILABLE = 502;

function statusCodeOf(reason: unknown): number | undefined {
  return (reason as { statusCode?: number }).statusCode;
}

export default function CabinLayoutDetailsRoute() {
  const { id = "" } = useParams();
  usePageTitle(`Cabin layout ${id}`);

  const { cabinLayoutService } = useApi();
  const [layoutState, setLayoutState] = useState<LayoutState>({ status: "loading" });
  const [cabinState, setCabinState] = useState<CabinState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setLayoutState({ status: "loading" });

    cabinLayoutService
      .fetchById(id)
      .then((layout) => {
        if (!cancelled) {
          setLayoutState({ status: "ready", layout });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLayoutState({ status: "missing" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cabinLayoutService, id]);

  const loadCabin = useCallback(() => {
    let cancelled = false;
    setCabinState({ status: "loading" });

    cabinLayoutService
      .fetchSeatMap(id)
      .then((seatMap) => {
        if (!cancelled) {
          setCabinState({ status: "ready", seatMap });
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setCabinState({ status: statusCodeOf(reason) === PROVIDER_UNAVAILABLE ? "unavailable" : "missing" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cabinLayoutService, id]);

  useEffect(loadCabin, [loadCabin]);

  if (layoutState.status === "missing") {
    return (
      <div className="pb-8">
        <Breadcrumbs
          className="my-6"
          items={[
            { label: "Cabin layouts", to: "/cabin-layouts" },
            { label: id, mono: true },
          ]}
        />
        <ContainerEmptyState>
          No layout with the identifier <span className="mx-1 font-mono">{id}</span> is catalogued.
        </ContainerEmptyState>
      </div>
    );
  }

  const layout = layoutState.status === "ready" ? layoutState.layout : null;
  const seatMap = cabinState.status === "ready" ? cabinState.seatMap : null;

  return (
    <div className="pb-8">
      <div className="mb-5 mt-2 flex items-center justify-between gap-4">
        <Breadcrumbs
          items={[
            { label: "Cabin layouts", to: "/cabin-layouts" },
            { label: id, mono: true },
          ]}
        />
        <RefreshCabinButton layoutId={id} onChanged={loadCabin} />
      </div>

      <div className="flex flex-col gap-4">
        <Container header={<CardHeader title="ID and metadata" />}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
              <DataField label="Airline" value={layout?.airlineIata ?? "—"} mono />
              <DataField label="Aircraft type" value={layout?.aircraftIata ?? "—"} mono />
              <DataField label="Variant" value={layout?.variant ?? "—"} mono />
              <DataField label="Revision" value={seatMap === null ? "—" : String(seatMap.revision)} mono />
              <DataField label="Read from" value={layout?.sourceSlugs.join(", ") ?? "—"} mono />
              <DataField
                label="First seen"
                value={layout === null ? "—" : dateToIcaoDate(new Date(layout.firstSeenAt))}
                mono
              />
              <DataField label="Aircraft" value={seatMap?.aircraftTypeDisplayed ?? "—"} />
              <DataField label="Manufacturer" value={seatMap?.manufacturer ?? "—"} />
              <DataField label="Haul" value={seatMap?.haulType ?? "—"} />
              <DataField label="LOPA revised" value={seatMap?.lastUpdated ?? "—"} mono />
              <DataField label="Total seats" value={seatMap === null ? "—" : String(seatMap.totalSeats)} mono />
              <DataField
                label="Withdrawn"
                value={
                  layout?.retiredAt === null || layout === null ? "No" : dateToIcaoDate(new Date(layout.retiredAt))
                }
                mono
              />
            </div>
            {layout?.retiredAt != null && (
              <Badge color="warning" size="sm">
                Withdrawn
              </Badge>
            )}
          </div>
        </Container>

        <Container header={<CardHeader title="Cabin layout and seats" />}>
          {cabinState.status === "loading" && (
            <span className="flex items-center gap-2 py-6 text-sm text-gray-500 dark:text-gray-400">
              <Spinner size="sm" />
              Retrieving the cabin from LOPA…
            </span>
          )}

          {cabinState.status === "unavailable" && (
            <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              Seating service is unavailable, the cabin cannot be drawn at the moment. The layout itself still can be
              used.
            </p>
          )}

          {cabinState.status === "missing" && (
            <p className="rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              LOPA holds no cabin for <span className="font-mono">{id}</span>.
            </p>
          )}

          {seatMap !== null && <SeatMap seatMap={seatMap} />}
        </Container>
      </div>
    </div>
  );
}

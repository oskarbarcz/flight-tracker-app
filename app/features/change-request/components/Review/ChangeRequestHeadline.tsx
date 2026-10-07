import React from "react";
import type { Airport } from "~/features/airport";
import { changeRequestHeadline } from "~/features/change-request/lib/changeRequestHeadline";
import { type ChangeRequestDetail, ChangeRequestResource } from "~/features/change-request/model";
import { UserName } from "~/features/user/components/UserName";
import { DetailLinkButton } from "~/shared/ui/Button/DetailLinkButton";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { AirportIdentity } from "~/shared/ui/Display/AirportIdentity";

const AIRPORT_SECTION: Record<ChangeRequestResource, string> = {
  [ChangeRequestResource.Airport]: "",
  [ChangeRequestResource.ParkingPosition]: "/parking-positions",
  [ChangeRequestResource.Gate]: "/gates",
  [ChangeRequestResource.Terminal]: "/terminals",
  [ChangeRequestResource.Runway]: "/runways",
};

export const CHANGE_REQUEST_HEADING_ID = "change-request-heading";

const HEADING_PROPS = { id: CHANGE_REQUEST_HEADING_ID, tabIndex: -1 } as const;

type Props = {
  detail: ChangeRequestDetail;
  airport: Airport | null;
  canOpenAirports: boolean;
};

function TargetAirport({
  detail,
  airport,
  size,
}: {
  detail: ChangeRequestDetail;
  airport: Airport | null;
  size: "md" | "lg";
}) {
  if (airport) {
    return (
      <AirportIdentity
        iataCode={airport.iataCode}
        name={airport.name}
        city={airport.city.name}
        country={airport.country.name}
        shape={airport.shape}
        size={size}
      />
    );
  }

  if (detail.target === null) {
    return null;
  }

  return (
    <span className="flex items-baseline gap-2 text-sm">
      <span className="font-mono font-bold text-gray-900 dark:text-white">{detail.target.airport.iataCode}</span>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <span className="text-gray-700 dark:text-gray-200">{detail.target.airport.name}</span>
    </span>
  );
}

function Title({ detail }: { detail: ChangeRequestDetail }) {
  const { noun, label, isCode } = changeRequestHeadline(detail);

  if (label === null) {
    return (
      <h2 {...HEADING_PROPS} className="text-2xl font-bold text-gray-500 outline-none dark:text-gray-400">
        Deleted {noun.toLowerCase()}
      </h2>
    );
  }

  if (!isCode) {
    return (
      <h2 {...HEADING_PROPS} className="sr-only">
        {label}
      </h2>
    );
  }

  return (
    <h2 {...HEADING_PROPS} className="text-2xl text-gray-900 outline-none dark:text-white">
      <span className="font-medium text-gray-500 dark:text-gray-400">{noun}</span>{" "}
      <span className="font-mono font-bold">{label}</span>
    </h2>
  );
}

export function ChangeRequestHeadline({ detail, airport, canOpenAirports }: Props) {
  const isAirport = detail.resource === ChangeRequestResource.Airport;
  const airportHref = detail.target ? `/airports/${detail.target.airport.id}${AIRPORT_SECTION[detail.resource]}` : null;

  return (
    <header className="flex flex-col gap-3">
      <Title detail={detail} />
      <TargetAirport detail={detail} airport={airport} size={isAirport ? "lg" : "md"} />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Proposed by <UserName user={detail.requestedBy} /> on <FormattedIcaoDate date={detail.createdAt} />{" "}
          <FormattedIcaoTime date={detail.createdAt} />
        </p>
        {canOpenAirports && airportHref && (
          <DetailLinkButton to={airportHref}>{isAirport ? "Open airport" : "Open in airport"}</DetailLinkButton>
        )}
      </div>
    </header>
  );
}

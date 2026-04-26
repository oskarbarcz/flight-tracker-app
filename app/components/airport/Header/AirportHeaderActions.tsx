import { Button } from "flowbite-react";
import React from "react";
import { HiOutlineExternalLink, HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import { FavoriteAirportButton } from "~/components/airport/Header/FavoriteAirportButton";
import { buildOpenStreetMapUrl } from "~/functions/formatGeo";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportHeaderActions({ airport }: Props) {
  const mapUrl = buildOpenStreetMapUrl(airport.location.latitude, airport.location.longitude);

  return (
    <div className="flex flex-wrap gap-2 items-start">
      <FavoriteAirportButton airportId={airport.id} />
      <Button as="a" href={mapUrl} target="_blank" rel="noreferrer" size="sm" color="light" className="space-x-1.5">
        <HiOutlineExternalLink />
        <span>View on map</span>
      </Button>
      <Button
        as={Link}
        to={`/airports/${airport.id}/edit`}
        viewTransition
        size="sm"
        color="indigo"
        className="space-x-1.5"
      >
        <HiPencil />
        <span>Edit</span>
      </Button>
    </div>
  );
}

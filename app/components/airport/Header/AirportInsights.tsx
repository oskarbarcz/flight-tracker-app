import React from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineFlight, MdOutlineMeetingRoom } from "react-icons/md";
import { TbBuildingAirport } from "react-icons/tb";
import { RichStatDisplay } from "~/components/shared/Display/RichStatDisplay";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportInsights({ airport }: Props) {
  const coords = `${airport.location.latitude.toFixed(3)}, ${airport.location.longitude.toFixed(3)}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <RichStatDisplay icon={TbBuildingAirport} color="indigo" title="Terminals" value="—" valueSuffix="Total" />
      <RichStatDisplay icon={MdOutlineMeetingRoom} color="green" title="Gates" value="—" valueSuffix="Total" />
      <RichStatDisplay icon={MdOutlineFlight} color="orange" title="Runways" value="—" valueSuffix="Total" />
      <RichStatDisplay icon={HiOutlineLocationMarker} color="blue" title="Coordinates" value={coords} valueSmaller />
    </div>
  );
}

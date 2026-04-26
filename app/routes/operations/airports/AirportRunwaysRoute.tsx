import React from "react";
import { ComingSoonState } from "~/components/airport/ComingSoonState";

export default function AirportRunwaysRoute() {
  return (
    <ComingSoonState
      feature="Runways"
      description="You will be able to manage runways (designators, length, surface) for this airport here."
    />
  );
}

import React from "react";
import { ComingSoonState } from "~/components/airport/ComingSoonState";

export default function AirportTerminalsRoute() {
  return (
    <ComingSoonState
      feature="Terminals"
      description="You will be able to define and edit terminals (e.g. T1, T2) for this airport here."
    />
  );
}

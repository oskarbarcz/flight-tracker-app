import React from "react";
import { ComingSoonState } from "~/components/airport/ComingSoonState";

export default function AirportGatesRoute() {
  return (
    <ComingSoonState
      feature="Gates"
      description="You will be able to manage gates (with optional terminal references) for this airport here."
    />
  );
}

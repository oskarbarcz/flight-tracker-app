import React from "react";
import Container from "~/components/shared/Layout/Container";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import useFlightOfp from "~/state/hooks/resources/useFlightOfp";

function unescapeOFP(html: string): string {
  return html
    .replace(/\\n/g, "<br />") // Newlines
    .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;") // Tabs
    .replace(/\\r/g, ""); // Remove carriage returns
}

export default function FlightOfpTab() {
  const { flight } = useTrackedFlight();
  const { ofp } = useFlightOfp(flight?.id ?? null);

  if (!flight || !ofp) {
    return null;
  }

  return (
    <Container>
      <div
        className="overflow-auto max-h-186 text-gray-700 dark:text-gray-300 font-mono"
        dangerouslySetInnerHTML={{ __html: unescapeOFP(ofp.ofpContent) || "" }}
      />
    </Container>
  );
}

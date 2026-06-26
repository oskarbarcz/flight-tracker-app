import React from "react";
import { Container } from "~/components/shared/Layout/Container";
import { RawHtml } from "~/components/shared/RawHtml";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { useFlightOfp } from "~/state/api/hooks/useFlightOfp";

function unescapeOFP(html: string): string {
  return html
    .replace(/\\n/g, "<br />")
    .replace(/\\toHuman/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
    .replace(/\\r/g, "");
}

export function FlightOfpTab() {
  const { flight } = useTrackedFlight();
  const { ofp } = useFlightOfp(flight?.id ?? null);

  if (!flight || !ofp) {
    return null;
  }

  return (
    <Container>
      <RawHtml
        className="overflow-auto max-h-186 text-gray-700 dark:text-gray-300 font-mono"
        html={unescapeOFP(ofp.ofpContent) || ""}
      />
    </Container>
  );
}

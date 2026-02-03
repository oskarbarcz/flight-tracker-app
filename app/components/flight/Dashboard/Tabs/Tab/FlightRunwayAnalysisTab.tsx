import React from "react";
import Container from "~/components/shared/Layout/Container";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import useFlightOfp from "~/state/hooks/resources/useFlightOfp";

export function unescapeOFP(html: string): string {
  return html
    .replace(/\\n/g, "<br />") // Newlines
    .replace(/\\"/g, '"') // Escaped quotes → real quotes
    .replace(/\\'/g, "'") // Escaped apostrophes
    .replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;") // Tabs
    .replace(/\\r/g, ""); // Remove carriage returns
}

export default function FlightRunwayAnalysisTab() {
  const { flight } = useTrackedFlight();
  const { ofp } = useFlightOfp(flight?.id ?? null);

  if (!flight || !ofp) {
    return null;
  }

  return (
    <Container>
      <div
        style={{ lineHeight: "14px", fontSize: "13px" }}
        className="overflow-auto max-h-186 text-black font-mono"
      >
        <b>[ Runway analysis ]</b>
        <br />
        <b>
          --------------------------------------------------------------------
        </b>
        <div
          dangerouslySetInnerHTML={{
            __html: unescapeOFP(ofp.runwayAnalysis) || "",
          }}
        />
      </div>
    </Container>
  );
}

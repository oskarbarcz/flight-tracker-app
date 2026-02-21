import React from "react";
import Container from "~/components/shared/Layout/Container";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import useFlightOfp from "~/state/hooks/resources/useFlightOfp";

function unescapeRunwayAnalysis(html: string): string {
  return html
    .replaceAll(" ", "&nbsp;") // Replace spaces with non-breaking spaces
    .replaceAll("\n", "<br />"); // Replace carriage returns
}

export default function FlightRunwayAnalysisTab() {
  const { flight } = useTrackedFlight();
  const { ofp } = useFlightOfp(flight?.id ?? null);

  if (!flight || !ofp) {
    return null;
  }

  return (
    <Container>
      <div className="overflow-auto leading-tight text-[13px] max-h-186 text-gray-700 dark:text-gray-300 font-mono">
        <b>[ Runway analysis ]</b>
        <br />
        <b>
          --------------------------------------------------------------------
        </b>
        <div
          dangerouslySetInnerHTML={{
            __html: unescapeRunwayAnalysis(ofp.runwayAnalysis) || "",
          }}
        />
      </div>
    </Container>
  );
}

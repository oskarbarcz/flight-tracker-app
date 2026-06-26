import React from "react";
import { Container } from "~/components/shared/Layout/Container";
import { RawHtml } from "~/components/shared/RawHtml";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { useFlightOfp } from "~/state/api/hooks/useFlightOfp";

function unescapeRunwayAnalysis(html: string): string {
  return html.replaceAll(" ", "&nbsp;").replaceAll("\n", "<br />");
}

export function FlightRunwayAnalysisTab() {
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
        <b>--------------------------------------------------------------------</b>
        <RawHtml html={unescapeRunwayAnalysis(ofp.runwayAnalysis) || ""} />
      </div>
    </Container>
  );
}

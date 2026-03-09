import React from "react";
import { Container } from "~/components/shared/Layout/Container";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import useFlightOfp from "~/state/api/hooks/useFlightOfp";

function unescapeOFP(html: string): string {
  return html
    .replace(/\\n/g, "<br />") // Newlines
    .replace(/\\toHuman/g, "&nbsp;&nbsp;&nbsp;&nbsp;") // Tabs
    .replace(/\\r/g, ""); // Remove carriage returns
}

export function FlightOfpTab() {
  const { flight } = useTrackedFlight();
  const { ofp } = useFlightOfp(flight?.id ?? null);

  if (!flight || !ofp) {
    return null;
  }

  return (
    <Container>
      <div
        className="overflow-auto max-h-186 text-gray-700 dark:text-gray-300 font-mono"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: we trust and verify SimBrief data
        dangerouslySetInnerHTML={{ __html: unescapeOFP(ofp.ofpContent) || "" }}
      />
    </Container>
  );
}

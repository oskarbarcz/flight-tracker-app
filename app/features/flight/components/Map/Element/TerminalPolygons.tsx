import { useMemo } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import type { Terminal } from "~/features/terminal";
import { TERMINAL_COLOR } from "~/shared/lib/mapColors";
import { roundedLatLngPolygon } from "~/shared/lib/roundedPolygon";

type Props = {
  terminals: Terminal[];
  showLabels?: boolean;
};

const CORNER_FRACTION = 0.04;

export function TerminalPolygons({ terminals, showLabels = true }: Props) {
  return (
    <>
      {terminals.map((t) => (
        <TerminalPolygon key={t.id} terminal={t} showLabel={showLabels} />
      ))}
    </>
  );
}

function TerminalPolygon({ terminal, showLabel }: { terminal: Terminal; showLabel: boolean }) {
  const positions = useMemo(() => {
    if (!terminal.shape || terminal.shape.length < 3) return null;
    return roundedLatLngPolygon(terminal.shape, CORNER_FRACTION);
  }, [terminal.shape]);

  if (!positions) return null;

  return (
    <Polygon positions={positions} pathOptions={{ className: "terminal-polygon", color: TERMINAL_COLOR, weight: 1.25 }}>
      {showLabel && (
        <Tooltip permanent direction="center" className="map-terminal-label">
          {terminal.fullName}
        </Tooltip>
      )}
    </Polygon>
  );
}

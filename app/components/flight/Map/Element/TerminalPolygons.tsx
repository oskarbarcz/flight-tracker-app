"use client";

import { useMemo } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import type { Terminal } from "~/models";

type Props = {
  terminals: Terminal[];
};

const STROKE_COLOR = "#eab308";

export function TerminalPolygons({ terminals }: Props) {
  return (
    <>
      {terminals.map((t) => (
        <TerminalPolygon key={t.id} terminal={t} />
      ))}
    </>
  );
}

function TerminalPolygon({ terminal }: { terminal: Terminal }) {
  const positions = useMemo(() => {
    if (!terminal.shape || terminal.shape.length < 3) return null;
    return terminal.shape.map((p) => [p.latitude, p.longitude] as [number, number]);
  }, [terminal.shape]);

  if (!positions) return null;

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        className: "terminal-polygon",
        color: STROKE_COLOR,
        weight: 1.5,
        fillOpacity: 0.2,
      }}
    >
      <Tooltip permanent direction="center" className="terminal-label">
        {terminal.shortName}
      </Tooltip>
    </Polygon>
  );
}

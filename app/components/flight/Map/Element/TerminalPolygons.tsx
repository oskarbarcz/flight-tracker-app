import type { LeafletMouseEvent } from "leaflet";
import { useMemo } from "react";
import { Polygon, Tooltip } from "react-leaflet";
import { TERMINAL_COLOR } from "~/functions/mapColors";
import type { Terminal } from "~/models";

type Props = {
  terminals: Terminal[];
};

const HOVER_CLASS = "terminal-label--hover";

function toggleTooltipHover(event: LeafletMouseEvent, on: boolean) {
  const tooltip = event.target.getTooltip();
  const el = tooltip?.getElement();
  if (!el) return;
  el.classList.toggle(HOVER_CLASS, on);
}

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
        color: TERMINAL_COLOR,
        weight: 1.5,
        fillOpacity: 0.2,
      }}
      eventHandlers={{
        mouseover: (e) => toggleTooltipHover(e, true),
        mouseout: (e) => toggleTooltipHover(e, false),
      }}
    >
      <Tooltip permanent direction="center" className="terminal-label">
        {terminal.shortName}
      </Tooltip>
    </Polygon>
  );
}

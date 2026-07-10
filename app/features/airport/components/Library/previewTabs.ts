import type { AirportMapLayer } from "~/features/airport/components/Overview/AirportLocationMap";

export type AirportPreviewTab = {
  key: string;
  title: string;
  layers: AirportMapLayer[];
};

const ALL_LAYERS: AirportMapLayer[] = ["shape", "terminals", "parkingPositions", "gates", "runways"];

export const airportPreviewTabs: AirportPreviewTab[] = [
  { key: "", title: "Details", layers: ALL_LAYERS },
  { key: "parking-positions", title: "Parking positions", layers: ["parkingPositions"] },
  { key: "terminals", title: "Terminals", layers: ["terminals"] },
  { key: "gates", title: "Gates", layers: ["gates"] },
  { key: "runways", title: "Runways", layers: ["runways"] },
  { key: "weather", title: "Weather", layers: ALL_LAYERS },
];

export function resolveActiveTab(pathname: string, airportId: string): AirportPreviewTab {
  const base = `/airports-library/${airportId}`;
  const segment = pathname.startsWith(base) ? pathname.slice(base.length).replace(/^\/+/, "") : "";
  return airportPreviewTabs.find((tab) => tab.key === segment) ?? airportPreviewTabs[0];
}

export function pathForTab(airportId: string, tab: AirportPreviewTab): string {
  return tab.key === "" ? `/airports-library/${airportId}` : `/airports-library/${airportId}/${tab.key}`;
}

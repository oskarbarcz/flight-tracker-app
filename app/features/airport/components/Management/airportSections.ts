import type { AirportMapLayer } from "~/features/airport/components/Overview/AirportLocationMap";

export type AirportSectionKey = "runways" | "terminals" | "parkingPositions" | "gates";

export type AirportSection = {
  key: AirportSectionKey;
  path: string;
  title: string;
  addLabel: string;
  filterPlaceholder: string;
  layers: AirportMapLayer[];
};

export const airportSections: AirportSection[] = [
  {
    key: "runways",
    path: "runways",
    title: "Runways",
    addLabel: "Add runway",
    filterPlaceholder: "Filter by designator",
    layers: ["shape", "runways"],
  },
  {
    key: "terminals",
    path: "terminals",
    title: "Terminals",
    addLabel: "Add terminal",
    filterPlaceholder: "Filter by name",
    layers: ["shape", "terminals"],
  },
  {
    key: "parkingPositions",
    path: "parking-positions",
    title: "Parking stands",
    addLabel: "Add parking stand",
    filterPlaceholder: "Filter by name or terminal",
    layers: ["shape", "parkingPositions"],
  },
  {
    key: "gates",
    path: "gates",
    title: "Gates",
    addLabel: "Add gate",
    filterPlaceholder: "Filter by name or terminal",
    layers: ["shape", "gates"],
  },
];

export function resolveActiveSection(pathname: string): AirportSection {
  const segments = pathname.split("/").filter(Boolean);
  return airportSections.find((section) => segments.includes(section.path)) ?? airportSections[0];
}

export const AIRPORT_MANAGEMENT_BASE = "/airports";
export const AIRPORT_LIBRARY_BASE = "/airports-library";

export function sectionPath(basePath: string, airportId: string, section: AirportSection): string {
  return `${basePath}/${airportId}/${section.path}`;
}

export function sectionCreatePath(airportId: string, section: AirportSection): string {
  return `${sectionPath(AIRPORT_MANAGEMENT_BASE, airportId, section)}/new`;
}

export function sectionMapTitle(section: AirportSection): string {
  return `Airport area and ${section.title.toLowerCase()}`;
}

const AIRPORT_EDIT_PARAM = "edit";
const AIRPORT_EDIT_VALUE = "airport";

export function airportEditPath(pathname: string): string {
  return `${pathname}?${AIRPORT_EDIT_PARAM}=${AIRPORT_EDIT_VALUE}`;
}

export function isAirportEditRequested(searchParams: URLSearchParams): boolean {
  return searchParams.get(AIRPORT_EDIT_PARAM) === AIRPORT_EDIT_VALUE;
}

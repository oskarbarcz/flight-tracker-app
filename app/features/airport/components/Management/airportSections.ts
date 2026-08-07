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
  const segment = pathname.split("/").filter(Boolean).at(-1) ?? "";
  return airportSections.find((section) => section.path === segment) ?? airportSections[0];
}

export function sectionPath(airportId: string, section: AirportSection): string {
  return `/airports/${airportId}/${section.path}`;
}

export function sectionCreatePath(airportId: string, section: AirportSection): string {
  return `${sectionPath(airportId, section)}/new`;
}

export function sectionMapTitle(section: AirportSection): string {
  return `Airport area and ${section.title.toLowerCase()}`;
}

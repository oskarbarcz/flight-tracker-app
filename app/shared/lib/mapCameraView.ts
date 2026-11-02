import type { LatLngTuple } from "leaflet";

export type MapCameraView = {
  center: LatLngTuple;
  zoom: number;
};

const LEAFLET_TILE_ZOOM_OFFSET = 1;

export function toMapLibreZoom(leafletZoom: number): number {
  return leafletZoom - LEAFLET_TILE_ZOOM_OFFSET;
}

export function toLeafletZoom(maplibreZoom: number): number {
  return maplibreZoom + LEAFLET_TILE_ZOOM_OFFSET;
}

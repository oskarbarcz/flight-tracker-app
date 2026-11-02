import type { LatLngTuple } from "leaflet";

export type MapFocusInsets = {
  top: number;
  right: number;
  bottom: number;
};

export type MapFocus = {
  position: LatLngTuple;
  zoom: number | null;
  insets: MapFocusInsets;
};

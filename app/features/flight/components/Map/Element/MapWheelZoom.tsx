import { useMap } from "react-leaflet";
import { useMapWheelZoom } from "~/features/flight/hooks/useMapWheelZoom";

export function MapWheelZoom() {
  useMapWheelZoom(useMap());

  return null;
}

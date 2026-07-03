import { MapContainer } from "react-leaflet";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";

export function BackgroundMap() {
  return (
    <MapContainer
      center={[30, 0]}
      zoom={3}
      minZoom={3}
      className="size-full z-10 bg-gray-800"
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
    >
      <MapTileLayer />
    </MapContainer>
  );
}

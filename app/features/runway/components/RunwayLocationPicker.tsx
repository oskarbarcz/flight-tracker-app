import { Label } from "flowbite-react";
import { useField } from "formik";
import L, { type LatLngExpression } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, useMapEvents } from "react-leaflet";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";

type Props = {
  airportLocation: { latitude: number; longitude: number };
  latitudeField?: string;
  longitudeField?: string;
};

const pinIcon = new L.DivIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4338ca" width="32px" height="32px">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      const wrapped = event.latlng.wrap();
      onPick(round6(wrapped.lat), round6(wrapped.lng));
    },
  });
  return null;
}

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

export function RunwayLocationPicker({
  airportLocation,
  latitudeField = "latitude",
  longitudeField = "longitude",
}: Props) {
  const [, latMeta, latHelpers] = useField<number>(latitudeField);
  const [, lonMeta, lonHelpers] = useField<number>(longitudeField);

  const latitude = latMeta.value;
  const longitude = lonMeta.value;

  const [initialCenter] = useState<LatLngExpression>(() => {
    if (latitude !== 0 || longitude !== 0) {
      return [latitude, longitude];
    }
    return [airportLocation.latitude, airportLocation.longitude];
  });

  const hasSelection = latitude !== 0 || longitude !== 0;

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 block">
        <Label>Runway start — click on the map to pick</Label>
      </div>
      <MapContainer
        center={initialCenter}
        zoom={14}
        scrollWheelZoom
        className="h-72 w-full rounded-xl z-0"
        attributionControl={false}
      >
        <MapTileLayer />
        <ClickHandler
          onPick={(lat, lng) => {
            latHelpers.setValue(lat);
            lonHelpers.setValue(lng);
            latHelpers.setTouched(true, false);
            lonHelpers.setTouched(true, false);
          }}
        />
        {hasSelection && <Marker position={[latitude, longitude]} icon={pinIcon} />}
      </MapContainer>
    </div>
  );
}

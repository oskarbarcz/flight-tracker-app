import { Button, Label } from "flowbite-react";
import { useField } from "formik";
import L, { type LatLngExpression } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, Tooltip, useMapEvents } from "react-leaflet";
import { MapTileLayer } from "~/features/flight/components/Map/Element/MapTileLayer";
import { PIN_COLOR } from "~/shared/lib/mapColors";
import type { Coordinates } from "~/shared/models/coordinates";

type Props = {
  field: string;
  airportLocation: Coordinates;
  label: string;
  pinLabel?: string;
};

const pinIcon = new L.DivIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${PIN_COLOR}" width="28px" height="28px">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
    </svg>
  `,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      const wrapped = event.latlng.wrap();
      onPick(round6(wrapped.lat), round6(wrapped.lng));
    },
  });
  return null;
}

export function PointCoordinatesPicker({ field, airportLocation, label, pinLabel }: Props) {
  const [, meta, helpers] = useField<Coordinates | null>(field);
  const value = meta.value;

  const [initialCenter] = useState<LatLngExpression>(() => {
    if (value) return [value.latitude, value.longitude];
    return [airportLocation.latitude, airportLocation.longitude];
  });

  const onPick = (lat: number, lng: number) => {
    helpers.setValue({ latitude: lat, longitude: lng }, true);
    helpers.setTouched(true, false);
  };

  const onClear = () => {
    helpers.setValue(null, true);
    helpers.setTouched(true, false);
  };

  return (
    <div className="mb-4 w-full">
      <div className="mb-2 flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
            {value
              ? `${value.latitude.toFixed(5)}, ${value.longitude.toFixed(5)}`
              : "no point — optional, click the map to set"}
          </span>
          <Button color="gray" size="xs" type="button" onClick={onClear} disabled={!value}>
            Clear
          </Button>
        </div>
      </div>
      <MapContainer
        center={initialCenter}
        zoom={15}
        scrollWheelZoom
        className="h-72 w-full rounded-xl z-0"
        attributionControl={false}
      >
        <MapTileLayer />
        <ClickHandler onPick={onPick} />
        {value && (
          <Marker position={[value.latitude, value.longitude]} icon={pinIcon}>
            {pinLabel && (
              <Tooltip permanent direction="top" offset={[0, -24]} className="gate-label">
                {pinLabel}
              </Tooltip>
            )}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

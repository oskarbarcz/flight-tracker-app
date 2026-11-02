import { SegmentedControl } from "~/features/flight/components/Map/Element/SegmentedControl";
import type { MapProjection } from "~/features/flight/hooks/useMapProjection";

const PROJECTION_OPTIONS: { value: MapProjection; label: string }[] = [
  { value: "mercator", label: "Mercator" },
  { value: "globe", label: "Globe" },
];

type Props = {
  value: MapProjection;
  onChange: (value: MapProjection) => void;
  stretch?: boolean;
};

export function MapProjectionSwitch({ value, onChange, stretch = false }: Props) {
  return (
    <SegmentedControl
      ariaLabel="Map projection"
      value={value}
      onChange={onChange}
      options={PROJECTION_OPTIONS}
      stretch={stretch}
    />
  );
}

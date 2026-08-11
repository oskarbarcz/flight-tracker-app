import { useFormikContext } from "formik";
import { twMerge } from "tailwind-merge";
import type { CreateAirportFormData } from "~/features/airport/form";
import { PolygonShapePicker } from "~/shared/ui/Form/MapPicker/PolygonShapePicker";

type Props = {
  className?: string;
};

export function AirportShapePickerSection({ className }: Props) {
  const { values } = useFormikContext<CreateAirportFormData>();
  const latitude = Number(values.latitude);
  const longitude = Number(values.longitude);
  const center =
    Number.isFinite(latitude) && Number.isFinite(longitude) && (latitude !== 0 || longitude !== 0)
      ? { latitude, longitude }
      : { latitude: 0, longitude: 0 };

  return (
    <PolygonShapePicker
      className={twMerge("h-full", className)}
      field="shape"
      airportLocation={center}
      label="Boundary"
      tone="airport"
    />
  );
}

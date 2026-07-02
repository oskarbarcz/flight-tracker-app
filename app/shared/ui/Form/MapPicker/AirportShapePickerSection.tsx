import { useFormikContext } from "formik";
import type { CreateAirportFormData } from "~/features/airport/form";
import { PolygonShapePicker } from "~/shared/ui/Form/MapPicker/PolygonShapePicker";

export function AirportShapePickerSection() {
  const { values } = useFormikContext<CreateAirportFormData>();
  const latitude = Number(values.latitude);
  const longitude = Number(values.longitude);
  const center =
    Number.isFinite(latitude) && Number.isFinite(longitude) && (latitude !== 0 || longitude !== 0)
      ? { latitude, longitude }
      : { latitude: 0, longitude: 0 };

  return (
    <PolygonShapePicker
      field="shape"
      airportLocation={center}
      label="Airport boundary — outline the perimeter"
      tone="airport"
    />
  );
}

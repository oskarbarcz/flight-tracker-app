import { useFormikContext } from "formik";
import { PolygonShapePicker } from "~/components/shared/Form/MapPicker/PolygonShapePicker";
import type { CreateAirportFormData } from "~/models/form/airport.form";

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

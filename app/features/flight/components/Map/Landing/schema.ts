import { type ObjectSchema, object, string } from "yup";

export type TrackPrivateFlightFormData = {
  flightId: string;
};

export const trackPrivateFlightSchema: ObjectSchema<TrackPrivateFlightFormData> = object({
  flightId: string().required("Enter a flight ID").uuid("That doesn't look like a valid flight ID"),
});

export function initTrackPrivateFlightData(): TrackPrivateFlightFormData {
  return { flightId: "" };
}

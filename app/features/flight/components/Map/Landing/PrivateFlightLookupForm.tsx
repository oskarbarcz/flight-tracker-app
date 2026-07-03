import { Button } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import { useNavigate } from "react-router";
import {
  initTrackPrivateFlightData,
  type TrackPrivateFlightFormData,
  trackPrivateFlightSchema,
} from "~/features/flight/components/Map/Landing/schema";
import { usePublicApi } from "~/shared/api/usePublicApi";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";

export function PrivateFlightLookupForm() {
  const { publicFlightService } = usePublicApi();
  const navigate = useNavigate();

  const handleSubmit = async (
    values: TrackPrivateFlightFormData,
    { setErrors, setSubmitting }: FormikHelpers<TrackPrivateFlightFormData>,
  ) => {
    try {
      await publicFlightService.fetchById(values.flightId);
      navigate(`/map/${values.flightId}`);
    } catch {
      setErrors({ flightId: "We couldn't find a flight with that ID" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<TrackPrivateFlightFormData>
      initialValues={initTrackPrivateFlightData()}
      validationSchema={trackPrivateFlightSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <FormikForm noValidate>
          <ManagedInputBlock field="flightId" label="Flight ID" />
          <Button type="submit" color="indigo" className="w-full" disabled={isSubmitting}>
            Track flight
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
}

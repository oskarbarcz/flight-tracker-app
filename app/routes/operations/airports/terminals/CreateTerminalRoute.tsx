import type { Route } from ".react-router/types/app/routes/operations/airports/terminals/+types/CreateTerminalRoute";
import { Button, Label, Textarea } from "flowbite-react";
import { Field, Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import { createTerminalSchema } from "~/features/terminal/schema";
import { terminalFormDataToRequest } from "~/features/terminal/transformer";
import { type CreateTerminalFormData, initCreateTerminalData } from "~/models";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { PolygonShapePicker } from "~/shared/ui/Form/MapPicker/PolygonShapePicker";
import { Container } from "~/shared/ui/Layout/Container";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";
import { AirportService } from "~/state/api/airport.service";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const airport = await new AirportService().fetchById(params.id);
  return { airport };
}

export default function CreateTerminalRoute({ params, loaderData }: Route.ComponentProps) {
  usePageTitle("Create new terminal");
  const { airport } = loaderData;

  const { terminalService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateTerminalFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateTerminalFormData>,
  ) => {
    try {
      await terminalService.createNew(params.id, terminalFormDataToRequest(values));
      navigate(`/airports/${params.id}/terminals`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateTerminalFormData>(err, setErrors, error, "Failed to create terminal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <SectionHeader title="Create new terminal" />

      <Formik<CreateTerminalFormData>
        initialValues={initCreateTerminalData()}
        validationSchema={createTerminalSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <FormikForm noValidate>
            <Container>
              <div className="flex flex-col">
                <div className="flex gap-4">
                  <div className="basis-1/3">
                    <ManagedInputBlock field="shortName" label="Short name" />
                  </div>
                  <div className="basis-2/3">
                    <ManagedInputBlock field="fullName" label="Full name" />
                  </div>
                </div>

                <ManagedInputBlock field="averageTaxiTime" label="Average taxi time (min)" type="number" />

                <ManagedInputBlock
                  field="operatorCodes"
                  label="Operator ICAO codes (comma separated)"
                  required={false}
                />

                <div className="mb-4 w-full">
                  <div className="mb-2 block">
                    <Label htmlFor="text">Briefing notes</Label>
                  </div>
                  <Field as={Textarea} id="text" name="text" rows={4} placeholder="Free-text notes shown to crews." />
                  <InputErrorList
                    errorFocus={Boolean(touched.text && errors.text)}
                    errors={touched.text && errors.text ? [errors.text] : []}
                  />
                </div>

                <PolygonShapePicker
                  field="shape"
                  airportLocation={airport.location}
                  label="Footprint — outline the terminal building"
                  tone="terminal"
                />
              </div>
            </Container>

            <div className="flex justify-end pt-4">
              <Button type="submit" color="indigo" disabled={isSubmitting}>
                Create terminal
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}

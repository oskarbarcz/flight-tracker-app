import type { Route } from ".react-router/types/app/routes/operations/airports/terminals/+types/EditTerminalRoute";
import { Button, Label, Textarea } from "flowbite-react";
import { Field, Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { InputErrorList } from "~/components/shared/Form/InputErrorList";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { PolygonShapePicker } from "~/components/shared/Form/MapPicker/PolygonShapePicker";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import type { CreateTerminalFormData } from "~/models";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { AirportService } from "~/state/api/airport.service";
import { useApi } from "~/state/api/context/useApi";
import { TerminalService } from "~/state/api/terminal.service";
import { terminalFormDataToRequest, terminalToFormData } from "~/state/api/transformer/terminal.transformer";
import { useToast } from "~/state/app/context/useToast";
import { createTerminalSchema } from "~/validator/form/terminal.schema";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [airport, terminal] = await Promise.all([
    new AirportService().fetchById(params.id),
    new TerminalService().fetchById(params.id, params.terminalId),
  ]);
  return { airport, terminal };
}

export default function EditTerminalRoute({ params, loaderData }: Route.ComponentProps) {
  const { airport, terminal } = loaderData;
  usePageTitle(`Edit terminal ${terminal.shortName}`);

  const { terminalService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateTerminalFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateTerminalFormData>,
  ) => {
    try {
      await terminalService.update(params.id, terminal.id, terminalFormDataToRequest(values));
      navigate(`/airports/${params.id}/terminals`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateTerminalFormData>(err, setErrors, error, "Failed to update terminal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <SectionHeader title={`Edit terminal ${terminal.shortName}`} />

      <Formik<CreateTerminalFormData>
        initialValues={terminalToFormData(terminal)}
        validationSchema={createTerminalSchema}
        enableReinitialize
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
                Save changes
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}

import type { Route } from ".react-router/types/app/routes/operations/airports/+types/EditAirportRoute";
import { redirect } from "react-router";
import {
  AIRPORT_MANAGEMENT_BASE,
  airportEditPath,
  airportSections,
  sectionPath,
} from "~/features/airport/components/Management/airportSections";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return redirect(airportEditPath(sectionPath(AIRPORT_MANAGEMENT_BASE, params.id, airportSections[0])));
}

export default function EditAirportRoute() {
  return null;
}

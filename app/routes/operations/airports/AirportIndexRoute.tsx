import type { Route } from ".react-router/types/app/routes/operations/airports/+types/AirportIndexRoute";
import { redirect } from "react-router";
import { airportSections, sectionPath } from "~/features/airport/components/Management/airportSections";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return redirect(sectionPath(params.id, airportSections[0]));
}

export default function AirportIndexRoute() {
  return null;
}

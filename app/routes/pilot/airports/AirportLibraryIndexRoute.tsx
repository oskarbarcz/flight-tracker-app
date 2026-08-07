import type { Route } from ".react-router/types/app/routes/pilot/airports/+types/AirportLibraryIndexRoute";
import { redirect } from "react-router";
import {
  AIRPORT_LIBRARY_BASE,
  airportSections,
  sectionPath,
} from "~/features/airport/components/Management/airportSections";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return redirect(sectionPath(AIRPORT_LIBRARY_BASE, params.id, airportSections[0]));
}

export default function AirportLibraryIndexRoute() {
  return null;
}

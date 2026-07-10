import type { Route } from ".react-router/types/app/routes/pilot/airports/+types/AirportWeatherTab";
import React from "react";
import { useLoaderData } from "react-router";
import type { AirportWeather } from "~/features/airport";
import { AirportWeatherPanel } from "~/features/airport/components/Library/AirportWeatherPanel";
import { AirportService } from "~/features/airport/service";

const EMPTY_WEATHER: AirportWeather = {
  metar: null,
  metarLastUpdate: null,
  taf: null,
  tafLastUpdate: null,
  watch: false,
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  try {
    const weather = await new AirportService().fetchWeather(params.id);
    return { weather };
  } catch {
    return { weather: EMPTY_WEATHER };
  }
}

export default function AirportWeatherTab() {
  const { weather } = useLoaderData<typeof clientLoader>();
  return <AirportWeatherPanel weather={weather} />;
}

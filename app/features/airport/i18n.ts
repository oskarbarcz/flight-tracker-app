import {
  Continent,
  OsmChangeStatus,
  OsmPushOutcome,
  OsmResource,
  WeatherInformationType,
  WeatherSource,
} from "~/features/airport";

export function translateContinent(continent: Continent): string {
  switch (continent) {
    case Continent.Africa:
      return "Africa";
    case Continent.Asia:
      return "Asia";
    case Continent.Europe:
      return "Europe";
    case Continent.NorthAmerica:
      return "North America";
    case Continent.Oceania:
      return "Oceania";
    case Continent.SouthAmerica:
      return "South America";
  }
}

export function translateWeatherSource(source: WeatherSource): string {
  switch (source) {
    case WeatherSource.AviationWeatherGov:
      return "AviationWeather";
    case WeatherSource.SayIntentions:
      return "SayIntentions AI";
  }
}

export function translateWeatherInformationType(informationType: WeatherInformationType): string {
  switch (informationType) {
    case WeatherInformationType.Atis:
      return "ATIS";
    case WeatherInformationType.Metar:
      return "METAR";
    case WeatherInformationType.Taf:
      return "TAF";
  }
}

export function translateOsmResource(resource: OsmResource): string {
  switch (resource) {
    case OsmResource.Airport:
      return "Airport";
    case OsmResource.Runway:
      return "Runways";
    case OsmResource.Terminal:
      return "Terminals";
    case OsmResource.ParkingPosition:
      return "Parking stands";
    case OsmResource.Gate:
      return "Gates";
  }
}

export function translateOsmRecord(resource: OsmResource): string {
  switch (resource) {
    case OsmResource.Airport:
      return "airport field";
    case OsmResource.Runway:
      return "runway";
    case OsmResource.Terminal:
      return "terminal";
    case OsmResource.ParkingPosition:
      return "parking stand";
    case OsmResource.Gate:
      return "gate";
  }
}

export function translateOsmChangeStatus(status: OsmChangeStatus): string {
  switch (status) {
    case OsmChangeStatus.Added:
      return "Add";
    case OsmChangeStatus.Updated:
      return "Update";
    case OsmChangeStatus.Removed:
      return "Remove";
    case OsmChangeStatus.NotChanged:
      return "Matches";
  }
}

export function translateOsmPushOutcome(outcome: OsmPushOutcome): string {
  switch (outcome) {
    case OsmPushOutcome.Added:
      return "Added";
    case OsmPushOutcome.Updated:
      return "Updated";
    case OsmPushOutcome.Removed:
      return "Removed";
    case OsmPushOutcome.Skipped:
      return "Skipped";
    case OsmPushOutcome.Failed:
      return "Failed";
  }
}

export function translateOsmChangeIntent(status: OsmChangeStatus): string {
  switch (status) {
    case OsmChangeStatus.Added:
      return "to add";
    case OsmChangeStatus.Updated:
      return "to update";
    case OsmChangeStatus.Removed:
      return "to remove";
    case OsmChangeStatus.NotChanged:
      return "already matching";
  }
}

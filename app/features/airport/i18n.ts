import { Continent, WeatherInformationType, WeatherSource } from "~/features/airport";

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

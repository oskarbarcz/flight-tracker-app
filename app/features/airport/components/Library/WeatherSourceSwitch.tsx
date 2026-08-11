import { allWeatherSources, type WeatherSource } from "~/features/airport";
import { WeatherSourceLabel } from "~/features/airport/components/Library/WeatherSourceLabel";

type Props = {
  selected: WeatherSource;
  onSelect: (source: WeatherSource) => void;
};

export function WeatherSourceSwitch({ selected, onSelect }: Props) {
  return (
    <fieldset
      aria-label="Weather source"
      className="inline-flex gap-0.5 rounded-lg border border-gray-200 p-0.5 dark:border-gray-800"
    >
      {allWeatherSources().map((source) => (
        <button
          key={source}
          type="button"
          aria-pressed={source === selected}
          onClick={() => onSelect(source)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            source === selected
              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <WeatherSourceLabel source={source} />
        </button>
      ))}
    </fieldset>
  );
}

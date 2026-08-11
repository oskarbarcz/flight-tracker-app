import type { IconType } from "react-icons";
import { LuBadgeCheck, LuSparkles } from "react-icons/lu";
import { WeatherSource } from "~/features/airport";
import { translateWeatherSource } from "~/features/airport/i18n";

const sourceIcons: Partial<Record<WeatherSource, IconType>> = {
  [WeatherSource.AviationWeatherGov]: LuBadgeCheck,
  [WeatherSource.SayIntentions]: LuSparkles,
};

type Props = {
  source: WeatherSource;
};

export function WeatherSourceLabel({ source }: Props) {
  const Icon = sourceIcons[source];

  return (
    <span className="inline-flex items-center gap-1">
      {Icon && <Icon aria-hidden className="size-3.5 shrink-0" />}
      {translateWeatherSource(source)}
    </span>
  );
}

import { Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, Radio } from "flowbite-react";
import { useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { useAuth } from "~/app-state/useAuth";
import { allWeatherSources, WeatherSource } from "~/features/airport";
import { WeatherSourceLabel } from "~/features/airport/components/Library/WeatherSourceLabel";
import { useApi } from "~/shared/api/useApi";

type Props = {
  current: WeatherSource;
  close: () => void;
  onChanged: () => void;
};

const failureMessage = "Weather source could not be changed. Try again in a moment.";

const sourceDescriptions: Record<WeatherSource, string> = {
  [WeatherSource.AviationWeatherGov]: "Real-world observations from AviationWeather service. Publishes METAR and TAF data.",
  [WeatherSource.SayIntentions]: "Weather used by Say Intentions AI service. Publishes ATIS alongside METAR and TAF.",
};

export function ChangeWeatherSourceModal({ current, close, onChanged }: Props) {
  const { refreshUser } = useAuth();
  const { userService } = useApi();
  const [selected, setSelected] = useState(current);
  const [isSaving, setIsSaving] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  async function save() {
    setIsSaving(true);
    setHasFailed(false);

    try {
      await userService.updateOwnProfile({ defaultWeatherSource: selected });
      await refreshUser();
    } catch {
      setHasFailed(true);
      setIsSaving(false);
      return;
    }

    onChanged();
  }

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>Change airport weather source</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <p className="mb-4 text-pretty text-sm text-gray-600 dark:text-gray-400">
          Airport weather opens on the provider you choose here. You can still switch source on any airport without
          changing this preference.
        </p>

        <fieldset aria-label="Airport weather source" className="space-y-3">
          {allWeatherSources().map((source) => (
            <button
              type="button"
              key={source}
              disabled={isSaving}
              className="flex select-none items-start gap-3 rounded-lg p-3 py-1.5 text-start hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSelected(source)}
            >
              <Radio
                id={`weather-source-${source}`}
                name="defaultWeatherSource"
                value={source}
                checked={selected === source}
                disabled={isSaving}
                onChange={() => setSelected(source)}
                className="mt-1.5 cursor-pointer"
              />
              <div className="flex-1">
                <Label
                  htmlFor={`weather-source-${source}`}
                  className="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  <WeatherSourceLabel source={source} />
                </Label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{sourceDescriptions[source]}</p>
              </div>
            </button>
          ))}
        </fieldset>

        {hasFailed && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-pretty text-sm text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
          >
            <FaCircleExclamation aria-hidden className="mt-0.5 shrink-0" />
            <span>{failureMessage}</span>
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline disabled={isSaving} onClick={close}>
            Cancel
          </Button>
          <Button color="indigo" disabled={isSaving || selected === current} aria-busy={isSaving} onClick={save}>
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

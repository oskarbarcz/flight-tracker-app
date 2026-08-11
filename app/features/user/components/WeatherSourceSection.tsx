import { Button } from "flowbite-react";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useAuth } from "~/app-state/useAuth";
import { WeatherSourceLabel } from "~/features/airport/components/Library/WeatherSourceLabel";
import { ChangeWeatherSourceModal } from "~/features/user/components/ChangeWeatherSourceModal";
import { RecordNote } from "~/shared/ui/Record/RecordNote";
import { RecordRow } from "~/shared/ui/Record/RecordRow";

const explanation =
  "Airport weather opens on this provider. Say Intentions publishes ATIS alongside METAR and TAF; AviationWeather publishes METAR and TAF only.";
const changedMessage = "Weather source changed. Airport weather now opens on this provider.";

export function WeatherSourceSection() {
  const { user } = useAuth();
  const [wasChanged, setWasChanged] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (user === null) {
    return null;
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <RecordRow
      label="Airport weather source"
      action={
        <Button color="light" size="sm" className="min-h-10 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
          Change source
        </Button>
      }
    >
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        <WeatherSourceLabel source={user.defaultWeatherSource} />
      </p>

      {wasChanged ? (
        <p role="status" className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400">
          <FaCircleCheck aria-hidden className="mt-0.5 shrink-0" />
          <span>{changedMessage}</span>
        </p>
      ) : (
        <RecordNote>{explanation}</RecordNote>
      )}

      {isModalOpen && (
        <ChangeWeatherSourceModal
          current={user.defaultWeatherSource}
          close={closeModal}
          onChanged={() => {
            setWasChanged(true);
            closeModal();
          }}
        />
      )}
    </RecordRow>
  );
}

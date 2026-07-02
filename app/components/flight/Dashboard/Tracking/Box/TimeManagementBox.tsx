import { useEffect, useState } from "react";
import { FaCircleInfo, FaClock, FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa6";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { FormattedLocalTime } from "~/shared/ui/Date/FormattedLocalTime";
import { FormattedTimezoneTime } from "~/shared/ui/Date/FormattedTimezoneTime";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function TimeManagementBox() {
  const { flight } = useTrackedFlight();

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);
    setCurrentTime(new Date());

    return () => clearInterval(interval);
  }, []);

  if (!flight) {
    return (
      <Container padding="condensed">
        <ContainerTitle icon={FaClock} title="Time management" />
        <div className="min-h-25 flex items-center justify-center text-gray-500">
          <FaCircleInfo className="inline mr-2" />
          <span>Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <ContainerTitle icon={FaClock} title="Time management" />
      <div className="flex items-center flex-wrap text-lg">
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Zulu time</span>
          <p className="font-bold">
            <FormattedIcaoTime date={currentTime} />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Date</span>
          <p className="font-bold">
            <FormattedIcaoDate date={currentTime} />
          </p>
        </div>
        <hr className="w-full mt-1 mb-3 border-gray-300 dark:border-gray-700" />
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Local time (now)</span>
          <p className="font-bold">
            <FormattedLocalTime date={currentTime} />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <p className="font-bold">
            <FaClock size="24" className="text-indigo-500 mr-4 inline-block" />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Departure ({flight.departureAirport.iataCode})</span>
          <p className="font-bold text-lg">
            <FormattedTimezoneTime date={currentTime} timezone={flight.departureAirport.timezone} />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <p className="font-bold">
            <FaPlaneDeparture size="32" className="text-indigo-500 mr-4 inline-block" />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Arrival ({flight.destinationAirport.iataCode})</span>
          <p className="font-bold text-lg">
            <FormattedTimezoneTime date={currentTime} timezone={flight.destinationAirport.timezone} />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <p className="font-bold">
            <FaPlaneArrival size="32" className="text-indigo-500 mr-4 inline-block" />
          </p>
        </div>
      </div>
    </Container>
  );
}

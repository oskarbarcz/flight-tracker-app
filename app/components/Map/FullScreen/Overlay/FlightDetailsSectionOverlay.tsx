import BasicFlightInfoOverlay from "~/components/Map/FullScreen/Overlay/BasicFlightInfoOverlay";
import { Flight } from "~/models";

type FlightDetailsSectionOverlayProps = {
  flight: Flight;
};

export default function FlightDetailsSectionOverlay({
  flight,
}: FlightDetailsSectionOverlayProps) {
  return (
    <div className="absolute flex flex-col gap-2 top-0 left-0 p-4 z-[400]">
      <BasicFlightInfoOverlay flight={flight} />
    </div>
  );
}

import LogoOverlay from "~/components/Map/FullScreen/Overlay/LogoOverlay";
import BasicFlightInfoOverlay from "~/components/Map/FullScreen/Overlay/BasicFlightInfoOverlay";
import { Flight } from "~/models";

type FlightDetailsSectionOverlayProps = {
  flight: Flight;
};

export default function FlightDetailsSectionOverlay({
  flight,
}: FlightDetailsSectionOverlayProps) {
  return (
    <div className="absolute flex flex-col gap-2 top-0 left-0 p-6 z-[400]">
      <LogoOverlay />
      <BasicFlightInfoOverlay flight={flight} />
    </div>
  );
}

import BasicFlightInfoOverlay from "~/components/Map/FullScreen/Overlay/BasicFlightInfoOverlay";
import { Flight } from "~/models";

type Props = {
  flight: Flight;
};

export default function FlightDetailsSectionOverlay({ flight }: Props) {
  return (
    <div className="absolute pointer-events-none w-full flex flex-col gap-2 top-0 left-0 p-2 md:p-4 z-30">
      <BasicFlightInfoOverlay flight={flight} />
    </div>
  );
}

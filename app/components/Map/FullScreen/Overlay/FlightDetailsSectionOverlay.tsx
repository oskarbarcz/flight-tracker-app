import BasicFlightInfoOverlay from "~/components/Map/FullScreen/Overlay/BasicFlightInfoOverlay";
import { Flight } from "~/models";
import { FaFileInvoice, FaUserGroup } from "react-icons/fa6";
import { Button } from "flowbite-react";
import { FaPlane } from "react-icons/fa";
import { useState } from "react";

type Props = {
  flight: Flight;
};

function activityToColor(isShown: boolean): string {
  return isShown ? "indigo" : "alternative";
}

export default function FlightDetailsSectionOverlay({ flight }: Props) {
  const [showFlightDetails, setShowFlightDetails] = useState<boolean>(true);

  return (
    <div className="absolute pointer-events-none w-full flex flex-col md:flex-row gap-3 top-0 left-0 p-3 z-30">
      <div className="flex pointer-events-auto md:flex-col gap-3">
        <Button
          color={activityToColor(showFlightDetails)}
          size="sm"
          onClick={() => setShowFlightDetails(!showFlightDetails)}
        >
          <FaPlane className="rotate-315" size={18} />
        </Button>
        <Button disabled color="alternative" size="sm" className="bg-gray-100">
          <FaFileInvoice size={18} />
        </Button>
        <Button disabled color="alternative" size="sm" className="bg-gray-100">
          <FaUserGroup size={18} />
        </Button>
      </div>
      <div>
        {showFlightDetails && <BasicFlightInfoOverlay flight={flight} />}
      </div>
    </div>
  );
}

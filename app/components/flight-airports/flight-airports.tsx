import Airport from "~/model/airport";

interface FlightAirportProps {
  departure: Airport;
  arrival: Airport;
}

export default function FlightAirports({ departure, arrival }: FlightAirportProps) {
  return <div className="mt-10 flex justify-between items-center gap-4">
    <div className="w-1/3 flex flex-col items-center">
      <div className="text-5xl font-bold mt-1 mb-2">{departure.icao}</div>
      <div className="pt-1">
        <div className="text-center text-md text-gray-500">{departure.name}</div>
        <div className="text-center text-md text-gray-500">{departure.country}</div>
      </div>
    </div>

    <div className="w-1/3">
      <svg className="w-6 h-6 text-gray-500 dark:text-white m-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
           width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 12H5m14 0-4 4m4-4-4-4"/>
      </svg>
    </div>

    <div className="w-1/3 flex flex-col items-center">
      <div className="text-5xl font-bold mt-1 mb-2">{arrival.icao}</div>
      <div className="pt-1">
        <div className="text-center text-md text-gray-500">{arrival.name}</div>
        <div className="text-center text-md text-gray-500">{arrival.country}</div>
      </div>
    </div>
  </div>;
}
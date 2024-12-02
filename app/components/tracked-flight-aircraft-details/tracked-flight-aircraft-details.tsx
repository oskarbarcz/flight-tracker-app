import Aircraft from "~/model/aircraft";
import Operator from "~/model/operator";

interface TrackedFlightAircraftDetailsProps {
  aircraft: Aircraft;
  operator: Operator;
}

export default function TrackedFlightAircraftDetails({ aircraft, operator }: TrackedFlightAircraftDetailsProps) {
  return <article
    className="border border-gray-300 shadow rounded-lg mt-5 flex justify-between items-center gap-4 p-8">
    <section className="w-1/3 text-center">
      <div className="text-5xl font-bold mt-1 mb-2">{aircraft.icaoCode}</div>
      <div className="text-md text-gray-500">Aircraft</div>
    </section>

    <section className="w-1/3 text-center">
      <div>
        <div className="text-3xl font-bold mt-4">{aircraft.registration}</div>
        <div className="text-md text-gray-500">Airframe</div>
      </div>
      <div>
        <div className="text-3xl font-bold mt-4">{aircraft.selcal}</div>
        <div className="text-md text-gray-500">SELCAL code</div>
      </div>
    </section>

    <section className="w-1/3 text-center">
      <div>
        <div className="text-3xl font-bold mt-4">{operator.shortName}</div>
        <div className="text-md text-gray-500">Operator</div>
      </div>
      <div>
        <div className="text-lg font-bold mt-4">{aircraft.livery}</div>
        <div className="text-md text-gray-500">Livery</div>
      </div>
    </section>
  </article>;
}
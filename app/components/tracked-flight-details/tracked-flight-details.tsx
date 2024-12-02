interface TrackedFlightDetailsProps {
  callsign: string;
  flightNumber: string;
}

export default function TrackedFlightDetails({ callsign, flightNumber }: TrackedFlightDetailsProps) {
  return <article className="border border-gray-300 shadow rounded-lg mt-5 flex justify-between items-center gap-4 p-8">
    <section className="w-1/3 text-center">
      <div className="text-5xl font-bold mt-1 mb-2">{callsign}</div>
      <div className="text-md pt-1 text-gray-500">Callsign</div>
    </section>

    <section className="w-1/3 text-center">
      <div className="text-5xl font-bold mt-1 mb-2">{flightNumber}</div>
      <div className="text-md pt-1 text-gray-500">Flight number</div>
    </section>
  </article>;
}
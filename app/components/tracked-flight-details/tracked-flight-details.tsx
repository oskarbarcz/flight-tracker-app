import Block from "~/components/block/block";

interface TrackedFlightDetailsProps {
  callsign: string;
  flightNumber: string;
}

export default function TrackedFlightDetails({ callsign, flightNumber }: TrackedFlightDetailsProps) {
  return <Block>
    <div className="flex justify-between items-center gap-4">
      <article className="w-1/3 text-center">
        <div className="text-5xl font-bold mt-1 mb-2">{callsign}</div>
        <div className="text-md pt-1 text-gray-500">Callsign</div>
      </article>

      <article className="w-1/3 text-center">
        <div className="text-5xl font-bold mt-1 mb-2">{flightNumber}</div>
        <div className="text-md pt-1 text-gray-500">Flight number</div>
      </article>
    </div>
  </Block>;
}
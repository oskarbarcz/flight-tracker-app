import {Button, Progress} from "flowbite-react";

interface TrackedFlightStatusProps {
  callsign: string;
  flightNumber: string;
}


export default function TrackedFlightStatus ({ callsign, flightNumber }: TrackedFlightStatusProps) {
  return <article
    className="border border-gray-300 shadow rounded-lg mt-20 flex justify-between items-center gap-4 p-8">
    <section className="text-center w-1/6">
      <div>
        <div className="text-3xl font-bold mt-2">{flightNumber}</div>
        <div className="text-md text-gray-500">Flight number</div>
      </div>
      <div>
        <div className="text-3xl font-bold mt-2">{callsign}</div>
        <div className="text-md text-gray-500">Callsign</div>
      </div>
    </section>

    <section className="w-2/3 text-center">
      <div className="flex flex-col gap-2">
        <Progress progress={45} color="dark" size="lg"/>
        <div className="w-fit mt-2 mx-auto text-gray-500">
          <div className="mb-2 border rounded-lg py-1 px-2 border-gray-500 uppercase">Preparation</div>
          <span className="pt-3">3h 40m remaining</span>
        </div>
      </div>
    </section>

    <section className="text-center w-1/6">
      <Button className="m-auto" disabled>Check-in</Button>
      <p className="mt-2 text-xs text-gray-500">This&nbsp;action&nbsp;is&nbsp;available 60&nbsp;minutes&nbsp;before&nbsp;boarding.</p>
    </section>
  </article>
}
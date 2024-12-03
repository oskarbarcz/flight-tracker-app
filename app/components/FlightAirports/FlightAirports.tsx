'use client'

import {Airport} from "~/models/airport.model";
import Block from "~/components/Block/Block";

interface FlightAirportProps {
  departure: Airport;
  arrival: Airport;
}

export default function FlightAirports({ departure, arrival }: FlightAirportProps) {
  return <Block>
    <div className="flex justify-between items-center gap-4">
      <article className="w-1/3 text-center">
        <div className="text-5xl font-bold mt-1 mb-2">{departure.icao}</div>
        <div className="pt-1">
          <div className="text-md text-gray-500">{departure.name}</div>
          <div className="text-md text-gray-500">{departure.country}</div>
        </div>
      </article>

      <div className="w-1/3">
        <svg className="w-6 h-6 text-gray-500 dark:text-white m-auto" aria-hidden="true"
             xmlns="http://www.w3.org/2000/svg"
             width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M19 12H5m14 0-4 4m4-4-4-4"/>
        </svg>
      </div>

      <article className="w-1/3 text-center">
        <div className="text-5xl font-bold mt-1 mb-2">{arrival.icao}</div>
        <div className="pt-1">
          <div className="text-md text-gray-500">{arrival.name}</div>
          <div className="text-md text-gray-500">{arrival.country}</div>
        </div>
      </article>
    </div>
  </Block>;
}
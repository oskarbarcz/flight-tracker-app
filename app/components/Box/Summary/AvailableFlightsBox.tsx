"use client";

import React from "react";
import { Flight } from "~/models";
import { Link } from "react-router";
import Container from "~/components/Layout/Container";
import { FaCircleInfo } from "react-icons/fa6";
import ContainerTitle from "~/components/Layout/ContainerTitle";

type AvailableFlightsBoxProps = {
  flight: Flight | undefined;
};

export default function AvailableFlightsBox({
  flight,
}: AvailableFlightsBoxProps) {
  return (
    <Container padding="condensed">
      <ContainerTitle>Available flights</ContainerTitle>

      {!flight && (
        <div className="min-h-[100px] flex items-center justify-center text-gray-500">
          <FaCircleInfo className="inline mr-2" />
          <span>There are no available flights for you.</span>
        </div>
      )}

      {flight && (
        <div>
          <Link
            to={`track/${flight.id}`}
            className="block text-teal-500 underline"
            viewTransition
          >
            {flight.flightNumber} [{flight.status}]
          </Link>
        </div>
      )}
    </Container>
  );
}

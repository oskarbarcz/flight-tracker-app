"use client";

import React from "react";
import Container, { ContainerClassProps } from "~/components/Layout/Container";
import { FaCircleInfo } from "react-icons/fa6";
import ContainerTitle from "~/components/Layout/ContainerTitle";

type FlightLogBoxProps = ContainerClassProps;

export default function FlightLogBox({ className }: FlightLogBoxProps) {
  return (
    <Container className={className} padding="condensed">
      <ContainerTitle>Flight log</ContainerTitle>
      <div className="min-h-[100px] flex items-center justify-center text-gray-500">
        <FaCircleInfo className="inline mr-2" />
        <span>Flight log will be available soon.</span>
      </div>
    </Container>
  );
}

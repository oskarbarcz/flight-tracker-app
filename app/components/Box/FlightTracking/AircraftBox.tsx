"use client";

import React from "react";
import Container from "~/components/Layout/Container";
import { FaCircleInfo } from "react-icons/fa6";
import ContainerTitle from "~/components/Layout/ContainerTitle";

export default function AircraftBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle>Aircraft</ContainerTitle>
      <div className="min-h-[100px] flex items-center justify-center text-gray-500">
        <FaCircleInfo className="inline mr-2" />
        <span>Aircraft details will be available soon.</span>
      </div>
    </Container>
  );
}

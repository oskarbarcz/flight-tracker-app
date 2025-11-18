"use client";

import React from "react";
import Container from "~/components/shared/Layout/Container";
import { FaCircleInfo } from "react-icons/fa6";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";

export default function CurrentRotationBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle>Current rotation</ContainerTitle>
      <div className="min-h-[100px] flex items-center justify-center text-gray-500">
        <FaCircleInfo className="inline mr-2" />
        <span>Rotation display will be available soon.</span>
      </div>
    </Container>
  );
}

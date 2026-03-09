"use client";

import { Button } from "flowbite-react";
import React from "react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";

type Props = {
  operatorId: string;
};

export function RotationControls({ operatorId }: Props) {
  return (
    <div className="mb-6">
      <Button
        color="indigo"
        as={Link}
        to={`/operators/${operatorId}/rotations/new`}
        size="sm"
        className="ms-auto w-fit"
      >
        <HiPlus />
        <span className="ml-2">Create rotation</span>
      </Button>
    </div>
  );
}

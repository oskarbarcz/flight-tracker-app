"use client";

import { Badge, Button } from "flowbite-react";
import React, { JSX } from "react";
import { HiPlus } from "react-icons/hi";
import { Link } from "react-router";
import type { Operator } from "~/models";

type Props = {
  operatorId: string;
};

export default function RotationControls({ operatorId }: Props): JSX.Element {
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

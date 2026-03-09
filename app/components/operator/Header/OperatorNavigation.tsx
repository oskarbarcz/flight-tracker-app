import { Button } from "flowbite-react";
import React, { type JSX } from "react";
import { HiOutlineArrowLeft, HiPencil } from "react-icons/hi";
import { Link } from "react-router";

type Props = {
  id: string;
};

export function OperatorNavigation({ id }: Props): JSX.Element {
  return (
    <div className="flex items-center justify-between mb-6">
      <Link
        className="flex items-center text-gray-500 hover:text-indigo-500 text-sm gap-3"
        to="/operators"
        viewTransition
      >
        <HiOutlineArrowLeft />
        Back to operators
      </Link>
      <Button as={Link} color="indigo" to={`/operators/${id}/edit`} className="space-x-1.5" size="sm" viewTransition>
        <HiPencil />
        <span>Edit operator</span>
      </Button>
    </div>
  );
}

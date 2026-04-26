import { Button } from "flowbite-react";
import React from "react";
import { HiOutlineArrowLeft, HiPencil } from "react-icons/hi";
import { Link } from "react-router";

type Props = {
  id: string;
};

export function AirportNavigation({ id }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <Link
        className="flex items-center text-gray-500 hover:text-indigo-500 text-sm gap-3"
        to="/airports"
        viewTransition
      >
        <HiOutlineArrowLeft />
        Back to airports
      </Link>
      <Button as={Link} color="indigo" to={`/airports/${id}/edit`} className="space-x-1.5" size="sm" viewTransition>
        <HiPencil />
        <span>Edit airport</span>
      </Button>
    </div>
  );
}

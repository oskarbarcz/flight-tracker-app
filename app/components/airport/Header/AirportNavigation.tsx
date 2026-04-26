import React from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { Link } from "react-router";

export function AirportNavigation() {
  return (
    <div className="flex items-center justify-between mb-4">
      <Link
        className="flex items-center text-gray-500 hover:text-indigo-500 text-sm gap-3"
        to="/airports"
        viewTransition
      >
        <HiOutlineArrowLeft />
        Back to airports
      </Link>
    </div>
  );
}

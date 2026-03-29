import { Button, Card } from "flowbite-react";
import React from "react";
import { FaHeadset } from "react-icons/fa";
import { PiAirplaneInFlightBold } from "react-icons/pi";
import { Link } from "react-router";
import { UserRole } from "~/models/user.model";

export type LandingRole = UserRole.CabinCrew | UserRole.Operations;

type Props = {
  role: LandingRole;
};

export function RoleCard({ role }: Props) {
  const isPilot = role === UserRole.CabinCrew;
  const title = isPilot ? "Pilot" : "Operator";
  const Icon = isPilot ? PiAirplaneInFlightBold : FaHeadset;
  const features = isPilot
    ? [
        "Check in to assigned flights",
        "Submit loadsheets before departure",
        "Report airborne and landing events",
        "Manage passenger disembarkation",
        "Work with tracked simulated passengers",
      ]
    : [
        "Manage fleet, rotations, and scheduling",
        "Control boarding and gate assignments",
        "Oversee full airline operations",
        "Set passenger counts and configurations",
      ];

  return (
    <Card className="max-w-md w-full hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800">
      <div className="flex flex-col items-center pb-6">
        <div className="mb-4 rounded-full bg-indigo-100 p-4 dark:bg-indigo-900/30">
          <Icon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h5 className="mb-1 text-2xl font-medium text-gray-900 dark:text-white">{title}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center h-5">
          {isPilot ? "Take control of the aircraft" : "Manage the airline operations"}
        </span>
        <ul className="space-y-3 mb-6 flex-1 w-full px-4 text-left">
          {features.map((feature) => (
            <li key={feature} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
              <span className="text-indigo-500 mr-2 mt-0.5">•</span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex w-full px-4 mt-auto">
          <Button as={Link} to="/sign-in" color={isPilot ? "indigo" : "light"} className="w-full">
            {isPilot ? "Fly as Pilot" : "Open Ops Center"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

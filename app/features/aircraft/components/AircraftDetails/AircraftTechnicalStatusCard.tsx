import { Badge } from "flowbite-react";
import React from "react";
import type { IconType } from "react-icons";
import {
  HiOutlineCheckCircle,
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type StatusRow = {
  icon: IconType;
  label: string;
  value: string;
};

type Props = {
  etopsThresholdMinutes: number | null;
};

export function AircraftTechnicalStatusCard({ etopsThresholdMinutes }: Props) {
  const rows: StatusRow[] = [
    { icon: HiOutlineClipboardCheck, label: "Open MEL items", value: "None" },
    { icon: HiOutlineCog, label: "Deferred defects (CDL)", value: "None" },
    { icon: HiOutlineCheckCircle, label: "General condition", value: "Good" },
    {
      icon: HiOutlineClock,
      label: "ETOPS threshold",
      value: etopsThresholdMinutes ? `${etopsThresholdMinutes} minutes` : "Not ETOPS-certified",
    },
  ];

  return (
    <Container>
      <ContainerTitle icon={HiOutlineShieldCheck} title="Technical status" />

      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
          <HiOutlineShieldCheck className="size-5" />
        </div>
        <div className="flex flex-col items-start">
          <Badge color="success" size="sm">
            Airworthy
          </Badge>
          <span className="mt-1 text-sm text-gray-500 dark:text-gray-400">Cleared for service, no restrictions</span>
        </div>
      </div>

      <dl className="divide-y divide-gray-100 dark:divide-gray-800">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2 py-2.5">
            <dt className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <row.icon className="size-4 text-gray-400" />
              {row.label}
            </dt>
            <dd className="text-sm font-semibold text-gray-800 dark:text-gray-100">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}

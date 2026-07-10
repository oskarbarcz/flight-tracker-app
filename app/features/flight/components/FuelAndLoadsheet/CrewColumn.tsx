import React from "react";
import { FaUserGroup } from "react-icons/fa6";
import { useAuth } from "~/app-state/useAuth";
import { type CrewMember, crewRoleLabel, isCaptain, isFlightDeckCrew, isPurser } from "~/features/flight";
import { useFlightCrew } from "~/features/flight/hooks/useFlightCrew";
import { UserName } from "~/features/user/components/UserName";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  flightId: string;
};

type CrewEntry = {
  id: string;
  name: string;
  role: string;
};

function toEntry(member: CrewMember): CrewEntry {
  return { id: member.id, name: member.name, role: crewRoleLabel(member.role) };
}

export function CrewColumn({ flightId }: Props) {
  const { crew, loading } = useFlightCrew(flightId);
  const { user } = useAuth();

  const flightDeck: CrewEntry[] = [
    ...(user ? [{ id: user.id, name: user.name, role: "Captain" }] : []),
    ...crew.filter((member) => isFlightDeckCrew(member) && !isCaptain(member)).map(toEntry),
  ];
  const purser = crew.filter(isPurser).map(toEntry);
  const cabinCrew = crew.filter((member) => !isFlightDeckCrew(member) && !isPurser(member)).map(toEntry);

  return (
    <Container className="lg:col-span-1">
      <ContainerTitle icon={FaUserGroup} title="Crew" />
      {loading ? (
        <CrewLoading />
      ) : (
        <div className="flex flex-col gap-4">
          <CrewSection label="Flight deck" members={flightDeck} />
          <CrewSection label="Purser" members={purser} />
          <CrewSection label="Cabin crew" members={cabinCrew} />
        </div>
      )}
    </Container>
  );
}

function CrewSection({ label, members }: { label: string; members: CrewEntry[] }) {
  return (
    <section className="flex flex-col gap-2.5">
      <FieldLabel>{label}</FieldLabel>
      {members.length === 0 ? (
        <span className="text-sm text-gray-400 dark:text-gray-500">Not assigned</span>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {members.map((member) => (
            <CrewRow key={member.id} member={member} />
          ))}
        </ul>
      )}
    </section>
  );
}

function CrewRow({ member }: { member: CrewEntry }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="flex size-7 flex-none items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        {crewInitials(member.name)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm">
          <UserName user={{ id: member.id, name: member.name }} />
        </span>
        <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{member.role}</span>
      </span>
    </li>
  );
}

function crewInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function CrewLoading() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex items-center gap-2.5">
          <div className="size-7 flex-none animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-2.5 w-1/3 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { RotationResponse } from "~/models";
import { useRotationService } from "~/state/hooks/api/useRotationService";
import { FaTrash } from "react-icons/fa";
import RemoveRotationModal from "~/components/Modal/RemoveRotationModal";

export default function RotationListRoute() {
  usePageTitle("Rotation list");
  const rotationService = useRotationService();
  const [rotations, setRotations] = React.useState<RotationResponse[]>([]);
  const [rotationToRemove, setRotationToRemove] =
    React.useState<RotationResponse | null>(null);

  useEffect(() => {
    rotationService.getAll().then(setRotations);
  }, [rotationService]);

  const removeRotation = async (flightId: string) => {
    await rotationService.remove(flightId);
    setRotations((state) => state.filter((prev) => !(prev.id === flightId)));
    setRotationToRemove(null);
  };

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <SectionHeaderWithLink
        sectionTitle="Rotations"
        linkText="Create new"
        linkUrl="/rotations/new"
      />
      <div className="overflow-x-auto rounded-2xl border dark:border-gray-700">
        <Table className="shadow">
          <Table.Head className="dark:text-gray-100">
            <Table.HeadCell>Rotation name</Table.HeadCell>
            <Table.HeadCell>Pilot ID</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Actions</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {rotations.map((rotation: RotationResponse, i: number) => (
              <Table.Row
                key={i}
                className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="text-gray-900 dark:text-white">
                  {rotation.name}
                </Table.Cell>
                <Table.Cell>
                  <div>
                    <span className="block text-gray-900 dark:text-white">
                      {rotation.pilot.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      License: {rotation.pilot.pilotLicenseId}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2 text-gray-500">
                    <Link
                      to={`/rotations/${rotation.id}/edit`}
                      replace
                      viewTransition
                    >
                      <Button color="gray">
                        <HiPencil />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => setRotationToRemove(rotation)}
                      color="failure"
                      size="xs"
                      className="flex cursor-pointer items-center"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {rotationToRemove && (
        <RemoveRotationModal
          rotation={rotationToRemove}
          remove={removeRotation}
          cancel={() => setRotationToRemove(null)}
        />
      )}
    </ProtectedRoute>
  );
}

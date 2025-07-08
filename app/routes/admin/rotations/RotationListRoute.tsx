"use client";

import React, { useEffect } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router";
import { HiPencil } from "react-icons/hi";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { RotationResponse } from "~/models";
import { useRotationService } from "~/state/hooks/api/useRotationService";
import { FaTrash } from "react-icons/fa";
import RemoveRotationModal from "~/components/Modal/RemoveRotationModal";
import { formatDateToLocal } from "~/functions/time";
import Container from "~/components/Container";
import RotationListTable from "~/components/Tables/RotationListTable";

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
      <Container className="overflow-x-auto" noPadding>
        <RotationListTable rotations={rotations} removeRotation={setRotationToRemove} />
      </Container>

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

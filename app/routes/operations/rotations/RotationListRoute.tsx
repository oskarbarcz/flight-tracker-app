"use client";

import React, { useEffect, useState } from "react";
import RemoveRotationModal from "~/components/rotation/Modal/RemoveRotationModal";
import RotationListTable from "~/components/rotation/Table/RotationListTable";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithLink from "~/components/shared/Section/SectionHeaderWithLink";
import { RotationResponse } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { useApi } from "~/state/contexts/content/api.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export default function RotationListRoute() {
  usePageTitle("Rotation list");
  const { rotationService } = useApi();
  const [rotations, setRotations] = useState<RotationResponse[]>([]);
  const [rotationToRemove, setRotationToRemove] =
    useState<RotationResponse | null>(null);

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
      <Container className="overflow-x-auto" padding="none">
        <RotationListTable
          rotations={rotations}
          removeRotation={setRotationToRemove}
        />
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

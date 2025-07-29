"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import SectionHeaderWithLink from "~/components/SectionHeaderWithLink";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { RotationResponse } from "~/models";
import RemoveRotationModal from "~/components/Modal/RemoveRotationModal";
import Container from "~/components/Container";
import RotationListTable from "~/components/Tables/RotationListTable";
import { useApi } from "~/state/contexts/api.context";

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
      <Container className="overflow-x-auto" noPadding>
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

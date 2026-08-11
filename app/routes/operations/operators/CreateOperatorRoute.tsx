import React from "react";
import { useNavigate, useRevalidator } from "react-router";
import { CreateOperatorModal } from "~/features/operator/components/Forms/CreateOperatorModal";

export default function CreateOperatorRoute() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const closeModal = () => navigate("/operators", { viewTransition: true });

  const handleCreated = async () => {
    await revalidator.revalidate();
    closeModal();
  };

  return <CreateOperatorModal close={closeModal} onCreated={handleCreated} />;
}

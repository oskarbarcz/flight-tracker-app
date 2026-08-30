import React from "react";
import { useNavigate } from "react-router";
import { CreateAirportModal } from "~/features/airport/components/Forms/CreateAirportModal";
import { useAirportList } from "~/features/airport/components/List/airportListContext";

export default function CreateAirportRoute() {
  const { reload, listPath } = useAirportList();
  const navigate = useNavigate();

  const handleCreated = () => {
    reload();
    navigate(listPath);
  };

  return <CreateAirportModal close={() => navigate(listPath)} onCreated={handleCreated} />;
}

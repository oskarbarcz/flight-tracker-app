import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";

type CloseFlightButtonProps = {
  flightId: string;
};

export default function CloseFlightButton({
  flightId,
}: CloseFlightButtonProps) {
  const { close } = useFlight();

  const onClick = async () => {
    await close(flightId);
  };

  return <Button onClick={onClick}>Close flight</Button>;
}

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";

type FinishOffboardingButtonProps = {
  flightId: string;
};

export default function FinishOffboardingButton({
  flightId,
}: FinishOffboardingButtonProps) {
  const { finishOffboarding } = useFlight();

  const onClick = async () => {
    await finishOffboarding(flightId);
  };

  return <Button onClick={onClick}>Finish offboarding</Button>;
}

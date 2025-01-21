import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";

type StartBoardingButtonProps = {
  flightId: string;
};

export default function StartBoardingButton({
  flightId,
}: StartBoardingButtonProps) {
  const { startBoarding } = useFlight();

  const onClick = async () => {
    await startBoarding(flightId);
  };
  return <Button onClick={onClick}>Start boarding</Button>;
}

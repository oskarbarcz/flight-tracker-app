import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";

type ReportTakeoffButtonProps = {
  flightId: string;
};

export default function ReportTakeoffButton({
  flightId,
}: ReportTakeoffButtonProps) {
  const { reportTakeoff } = useFlight();

  const onClick = async () => {
    await reportTakeoff(flightId);
  };

  return <Button onClick={onClick}>Report takeoff</Button>;
}

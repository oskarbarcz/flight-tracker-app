import { Route } from "../../../.react-router/types/app/routes/public/+types/PublicTrackingRoute";
import { useLoaderData } from "react-router";
import FullScreenMap from "~/components/Map/FullScreen/FullScreenMap";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { flightId: params.id };
}

export default function PublicTrackingRoute() {
  const { flightId } = useLoaderData<typeof clientLoader>();

  return (
    <div className="h-screen w-screen">
      <FullScreenMap flightId={flightId} />
    </div>
  );
}

import { Route } from "../../../.react-router/types/app/routes/public/+types/PublicTrackingRoute";
import { useLoaderData } from "react-router";
import FullScreenMap from "~/components/Map/FullScreen/FullScreenMap";
import TopBar from "~/components/Map/FullScreen/TopBar";
import BottomBar from "~/components/Map/FullScreen/BottomBar";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { flightId: params.id };
}

export default function PublicTrackingRoute() {
  const { flightId } = useLoaderData<typeof clientLoader>();

  return (
    <div className="flex flex-col items-stretch size-full p-2">
      <TopBar />
      <FullScreenMap flightId={flightId} />
      <BottomBar />
    </div>
  );
}

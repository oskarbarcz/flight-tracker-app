import MapCenteringSettings from "~/components/Map/Element/MapCenteringSettings";

export default function MapBottomDrawer() {
  return (
    <div className="absolute pointer-events-none rounded-2xl w-full bottom-0 left-0 right-0 p-3 z-10">
      <MapCenteringSettings />
    </div>
  );
}

import MapCenteringSettings from "~/components/flight/Map/Element/MapCenteringSettings";

type Props = {
  size?: "sm" | "md";
};

export default function MapBottomDrawer({ size = "md" }: Props) {
  return (
    <div className="absolute pointer-events-none rounded-2xl w-full bottom-0 left-0 right-0 p-3 z-10">
      <MapCenteringSettings size={size} />
    </div>
  );
}

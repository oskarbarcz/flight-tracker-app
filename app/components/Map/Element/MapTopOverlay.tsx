type MapTopOverlayProps = {
  isTrackable: boolean;
};

export default function MapTopOverlay({ isTrackable }: MapTopOverlayProps) {
  return (
    <div className="absolute rounded-4xl grid grid-flow-col p-4 w-full top-0 z-[500] text-xs">
      <div className="bg-white justify-items-start w-fit flex gap-4 rounded-2xl px-4 py-2 dark:bg-gray-800 shadow border border-indigo-100">
        {isTrackable ? (
          <span className="flex items-center font-bold uppercase animate-pulse">
            <span className="bg-red-600  h-3 rounded-full w-3 inline-block mr-1"></span>
            Live
          </span>
        ) : (
          <span className="font-bold text-gray-500">Flight history</span>
        )}
      </div>

      {isTrackable ?? (
        <div className="bg-white w-fit justify-self-center flex flex-col lg:flex-row gap-4 rounded-2xl px-6 py-2 dark:bg-gray-800 shadow border border-indigo-100">
          <div className="flex items-center">
            <span className="mr-1">HDG</span>
            <span className="font-bold text-indigo-500">123°</span>
          </div>

          <div className="flex items-center">
            <span className="mr-1">ALT</span>
            <span className="font-bold text-indigo-500">39 900</span>
          </div>

          <div className="flex items-center">
            <span className="mr-1">GS</span>
            <span className="font-bold text-indigo-500">250</span>
          </div>
        </div>
      )}

      {isTrackable ? (
        <div className="h-[1px] w-[80px]"></div>
      ) : (
        <div className="h-[1px] w-[115px]"></div>
      )}
    </div>
  );
}

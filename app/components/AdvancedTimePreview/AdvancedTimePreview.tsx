"use client";

interface AdvancedTimePreviewProps {
  plannedTime: string;
  plannedDay?: string;
  description: string;
}

export default function AdvancedDateTimePreview(
  props: AdvancedTimePreviewProps,
) {
  return (
    <div className="mt-4 flex flex-col items-center first:mt-0">
      <div className="text-3xl font-bold">{props.plannedTime}</div>
      {props.plannedDay !== undefined ? (
        <div className="text-lg font-bold">{props.plannedDay}</div>
      ) : (
        ""
      )}
      <div className="text-gray-500">{props.description}</div>
    </div>
  );
}

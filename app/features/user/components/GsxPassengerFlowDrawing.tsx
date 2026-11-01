import {
  arrowheadAt,
  FIRST_ROW_X,
  type PassengerLoop,
  passengerLoops,
  pointAlong,
  ROW_COUNT,
  ROW_PITCH,
  restingPlans,
  SEAT_LENGTH,
} from "~/features/user/lib/gsxPassengerFlow";
import type { GsxPassengerFlow } from "~/features/user/lib/gsxSettings";
import { prefersReducedMotion } from "~/shared/lib/reducedMotion";

type Props = {
  flow: GsxPassengerFlow;
  active: boolean;
};

const ROWS = Array.from({ length: ROW_COUNT }, (_, row) => row);
const SEAT_WIDTH = 6.5;
const SEAT_POSITIONS_ACROSS = [51, 58.5, 66, 79.5, 87, 94.5];
const PASSENGER_RADIUS = 2.6;

const SHELL = "stroke-gray-300 dark:stroke-gray-700";
const SHELL_FILL = "fill-white dark:fill-gray-900";
const WING_FILL = "fill-gray-200/70 dark:fill-gray-800";

function Seats({ row, className }: { row: number; className: string }) {
  return SEAT_POSITIONS_ACROSS.map((across) => (
    <rect
      key={across}
      x={FIRST_ROW_X + row * ROW_PITCH}
      y={across}
      width={SEAT_LENGTH}
      height={SEAT_WIDTH}
      rx={1.5}
      strokeWidth={0.75}
      className={className}
    />
  ));
}

function WalkingPassengers({ loop, className }: { loop: PassengerLoop; className: string }) {
  return loop.walks.map(({ row, path, motionKeyTimes, fadeKeyTimes }) => (
    <circle key={row} r={PASSENGER_RADIUS} opacity={0} className={className}>
      <animateMotion
        dur={loop.duration}
        repeatCount="indefinite"
        path={path}
        calcMode="linear"
        keyPoints="0;0;1;1"
        keyTimes={motionKeyTimes}
      />
      <animate
        attributeName="opacity"
        dur={loop.duration}
        repeatCount="indefinite"
        values="0;0;1;1;0;0"
        keyTimes={fadeKeyTimes}
      />
    </circle>
  ));
}

function Engine({ centre }: { centre: number }) {
  return (
    <>
      <path
        d={`M150 ${centre - 9} C158 ${centre - 11} 174 ${centre - 11} 192 ${centre - 5} V${centre + 5} C174 ${centre + 11} 158 ${centre + 11} 150 ${centre + 9} Z`}
        strokeWidth={1}
        className={`${SHELL_FILL} ${SHELL}`}
      />
      <path d={`M154 ${centre - 9} V${centre + 9}`} strokeWidth={1} className={SHELL} />
    </>
  );
}

export function GsxPassengerFlowDrawing({ flow, active }: Props) {
  const { route, passengers, isRowOccupied } = restingPlans[flow];
  const loop = active && !prefersReducedMotion() ? passengerLoops[flow] : null;
  const flowStroke = active ? "stroke-indigo-500 dark:stroke-indigo-400" : "stroke-gray-400 dark:stroke-gray-600";
  const passengerFill = active ? "fill-indigo-500 dark:fill-indigo-400" : "fill-gray-400 dark:fill-gray-500";

  return (
    <svg
      key={loop === null ? "at-rest" : "walking"}
      viewBox="0 0 264 152"
      fill="none"
      aria-hidden={true}
      className="block w-full"
    >
      <rect x={0} y={0} width={18} height={152} className="fill-gray-200 dark:fill-gray-800" />
      <text
        x={9}
        y={76}
        transform="rotate(-90 9 76)"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-gray-600 text-2xs font-bold tracking-wider dark:fill-gray-400"
      >
        GATE
      </text>

      <path
        d="M158 48 L181 0 H246 L242 8 L236 48 Z M158 104 L181 152 H246 L242 144 L236 104 Z"
        strokeWidth={1}
        className={`${WING_FILL} ${SHELL}`}
      />
      <path d="M226 48 L232 8 L236 0 M226 104 L232 144 L236 152" strokeWidth={1} className={SHELL} />
      <Engine centre={14} />
      <Engine centre={138} />

      <path
        d="M264 48 H76 C52 48 30 62 30 76 C30 90 52 104 76 104 H264"
        strokeWidth={1}
        className={`${SHELL_FILL} ${SHELL}`}
      />
      <path d="M62 51 V101" strokeWidth={1} className={SHELL} />
      <path d="M41 66 Q37 76 41 86" strokeWidth={1.5} strokeLinecap="round" className={SHELL} />

      {ROWS.map((row) => (
        <Seats key={row} row={row} className="stroke-gray-300 dark:stroke-gray-600" />
      ))}

      {ROWS.filter((row) => loop !== null || isRowOccupied(row)).map((row) => (
        <g key={row}>
          <Seats row={row} className="fill-gray-400 stroke-gray-400 dark:fill-gray-500 dark:stroke-gray-500" />
          {loop !== null && (
            <animate
              attributeName="opacity"
              dur={loop.duration}
              repeatCount="indefinite"
              values={loop.walks[row].seatValues}
              keyTimes={loop.walks[row].seatKeyTimes}
            />
          )}
        </g>
      ))}

      <path d="M18 118 H73 V104 H87 V130 H18 Z" strokeWidth={1} className={`${SHELL_FILL} ${SHELL}`} />
      <path d="M46 118 V130" strokeWidth={1} className={SHELL} />
      <path d="M74 104 H86" strokeWidth={2} className="stroke-white dark:stroke-gray-900" />

      <polyline
        points={route.map(({ x, y }) => `${x},${y}`).join(" ")}
        strokeWidth={1}
        strokeDasharray="2 3"
        className={flowStroke}
      />
      <path
        d={arrowheadAt(route)}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={flowStroke}
      />

      {loop === null ? (
        passengers.map((distance) => {
          const { x, y } = pointAlong(route, distance);

          return <circle key={distance} cx={x} cy={y} r={PASSENGER_RADIUS} className={passengerFill} />;
        })
      ) : (
        <WalkingPassengers loop={loop} className={passengerFill} />
      )}
    </svg>
  );
}

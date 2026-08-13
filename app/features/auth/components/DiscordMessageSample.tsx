import {
  DiscordMessage,
  DiscordMessageFrame,
  MessageAttachment,
  MessageCodeBlock,
  MessageHeading,
  MessageManageLine,
  MessageValue,
} from "~/features/auth/components/DiscordMessageFrame";
import type { DiscordMessageId } from "~/features/auth/lib/discordFeatures";

const flight = {
  number: "LO 281",
  departure: { city: "Warsaw", iataCode: "WAW" },
  destination: { city: "London", iataCode: "LHR" },
  aircraft: { registration: "SP-LRA", type: "B788" },
} as const;

const briefing = {
  sentAt: "Today at 08:35",
  schedule: ["out: 09:35z", "off: 09:52z", "on:  11:44z", "in:  11:58z", "", "block: 2h 23m"].join("\n"),
  metar: "EPWA 120830Z 25012KT 9999 SCT028 18/11 Q1015 NOSIG",
  ofp: { fileName: "LOT281_PDF_1754993700.pdf", size: "412 KB" },
} as const;

const loadsheets = {
  preliminary: {
    sentAt: "Today at 09:05",
    crew: ["CPT Michael Doe", "FO  Jane Roe", "PU  Anna Nowak", "FA  Piotr Zawada"].join("\n"),
    load: [
      "crew:        2 + 0 relief, 8 cabin",
      "passengers:  201",
      "cargo:       4.2 t",
      "payload:     24.8 t",
      "zero fuel:   140.1 t",
      "block fuel:  38.6 t",
    ].join("\n"),
  },
  final: {
    sentAt: "Today at 09:28",
    crew: ["CPT Michael Doe", "FO  Jane Roe", "PU  Anna Nowak", "FA  Piotr Zawada"].join("\n"),
    load: [
      "crew:        2 + 0 relief, 8 cabin",
      "passengers:  199",
      "cargo:       4.4 t",
      "payload:     24.6 t",
      "zero fuel:   139.9 t",
      "block fuel:  38.6 t",
    ].join("\n"),
  },
} as const;

const delay = {
  allocation: { sentAt: "Today at 09:48", minutes: 35 },
  approval: { sentAt: "Today at 10:02" },
} as const;

const frameLabels: Record<DiscordMessageId, string> = {
  briefing:
    "Screenshot of a Discord direct message from Flight Tracker: the briefing for flight LO 281 from Warsaw to London, with the estimated schedule, the departure METAR, a link back to the app, and the operational flight plan attached as a PDF.",
  preliminaryLoadsheet:
    "Screenshot of a Discord direct message from Flight Tracker: the preliminary loadsheet for flight LO 281, listing the crew and the planned load.",
  finalLoadsheet:
    "Screenshot of a Discord direct message from Flight Tracker: the final loadsheet for flight LO 281, listing the crew and the load as it stands for departure.",
  delay:
    "Screenshot of two Discord direct messages from Flight Tracker: a 35 minute departure delay on flight LO 281 waiting to be allocated, and operations approving the allocation.",
};

function BriefingSample() {
  return (
    <DiscordMessage sentAt={briefing.sentAt}>
      <MessageHeading>📋 Flight {flight.number} briefing</MessageHeading>

      <p>
        Route: <MessageValue>{`${flight.departure.city} (${flight.departure.iataCode})`}</MessageValue> to{" "}
        <MessageValue>{`${flight.destination.city} (${flight.destination.iataCode})`}</MessageValue>
        <br />
        Aircraft: <MessageValue>{flight.aircraft.registration}</MessageValue> ({flight.aircraft.type})
      </p>

      <p>Estimated schedule:</p>
      <MessageCodeBlock>{briefing.schedule}</MessageCodeBlock>

      <p>METAR:</p>
      <MessageCodeBlock>{briefing.metar}</MessageCodeBlock>

      <MessageManageLine action="Manage your flight in" />

      <MessageAttachment fileName={briefing.ofp.fileName} size={briefing.ofp.size} />
    </DiscordMessage>
  );
}

function LoadsheetSample({ kind }: { kind: "preliminary" | "final" }) {
  const { sentAt, crew, load } = loadsheets[kind];

  return (
    <DiscordMessage sentAt={sentAt}>
      <MessageHeading>
        📋 Flight {flight.number} {kind} loadsheet
      </MessageHeading>

      <p>Crew:</p>
      <MessageCodeBlock>{crew}</MessageCodeBlock>

      <p>Load:</p>
      <MessageCodeBlock>{load}</MessageCodeBlock>

      <MessageManageLine action="Manage your flight in" />
    </DiscordMessage>
  );
}

function DelaySamples() {
  return (
    <>
      <DiscordMessage sentAt={delay.allocation.sentAt}>
        <MessageHeading>⌛ Flight {flight.number} delay</MessageHeading>

        <p>
          A departure delay of <MessageValue>{delay.allocation.minutes} minutes</MessageValue> was recorded and has to
          be allocated.
        </p>

        <MessageManageLine action="Allocate it in" />
      </DiscordMessage>

      <DiscordMessage sentAt={delay.approval.sentAt}>
        <MessageHeading>✅ Flight {flight.number} delay approved</MessageHeading>

        <p>Operations approved your delay allocation.</p>

        <MessageManageLine action="Manage your flight in" />
      </DiscordMessage>
    </>
  );
}

const samples: Record<DiscordMessageId, () => React.JSX.Element> = {
  briefing: BriefingSample,
  preliminaryLoadsheet: () => <LoadsheetSample kind="preliminary" />,
  finalLoadsheet: () => <LoadsheetSample kind="final" />,
  delay: DelaySamples,
};

export function DiscordMessageSample({ id }: { id: DiscordMessageId }) {
  const Sample = samples[id];

  return (
    <DiscordMessageFrame label={frameLabels[id]}>
      <Sample />
    </DiscordMessageFrame>
  );
}

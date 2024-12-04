import {Flight, ScheduledFlightsListElement} from "~/models";

export function getOneFlight(): Flight {
  return {
    flightNumber: "LH 415",
    callsign: "DLH 1KY",
    departure: {
      icao: "EDDF",
      gate: "V101",
      name: "Frankfurt Rhein-Main",
      country: "Germany",
      timezone: "+01:00"
    },
    arrival: {
      icao: "KORD",
      gate: "C10",
      name: "Chicago O'Hare Intl",
      country: "United States of America",
      timezone: "-06:00"
    },
    aircraft: {
      icaoCode: "A333",
      shortName: "A330-300",
      fullName: "Airbus A330-300 RR",
      registration: "D-AIDA",
      selcal: "SP-LR",
      livery: "Sunshine (2024)"
    },
    operator: {
      icaoCode: "DLH",
      shortName: "Lufthansa",
      fullName: "Deutsche Lufthansa AG"
    },
    alternates: [
      {
        icao: "KIND",
        gate: null,
        name: "Indianapolis Intl",
        country: "United States of America",
        timezone: "-06:00"
      },
      {
        icao: "KMKE",
        gate: null,
        name: "Milwaukee Mitchell Intl",
        country: "United States of America",
        timezone: "-06:00"
      }
    ],
    timesheet: {
      estimated: {
        offBlockTime: new Date("01-12-2024 9:00"),
        takeoffTime: new Date("01-12-2024 9:20"),
        blockTime: "7:55",
        airTime: "7:30",
        landingTime: new Date("01-12-2024 18:00"),
        onBlockTime: new Date("01-12-2024 18:05")
      },
      scheduled: {
        offBlockTime: new Date("01-12-2024 9:00"),
        takeoffTime: new Date("01-12-2024 9:20"),
        blockTime: "7:55",
        airTime: "7:30",
        landingTime: new Date("01-12-2024 18:00"),
        onBlockTime: new Date("01-12-2024 18:05")
      },
      actual: {
        offBlockTime: new Date("01-12-2024 9:00"),
        takeoffTime: new Date("01-12-2024 9:20"),
        blockTime: "7:55",
        airTime: "7:30",
        landingTime: new Date("01-12-2024 18:00"),
        onBlockTime: new Date("01-12-2024 18:05")
      }
    },
    status:"ready",
  }
}

export function getFlightsList(): ScheduledFlightsListElement[] {
  return [
    {
      flightNumber: "LH 416",
      callsign: "DLH 1KY",
      departure: {
        icao: "EDDF",
        gate: "V101",
        name: "Frankfurt Rhein-Main",
        country: "Germany",
        timezone: "+01:00"
      },
      arrival: {
        icao: "KORD",
        gate: "C10",
        name: "Chicago O'Hare Intl",
        country: "United States of America",
        timezone: "-06:00"
      },
      aircraft: {
        icaoCode: "A333",
        shortName: "A330-300",
        fullName: "Airbus A330-300 RR",
        registration: "D-AIDA",
        selcal: "SP-LR",
        livery: "Sunshine (2024)"
      },
      timesheet: {
        scheduled: {
          offBlockTime: new Date("01-12-2024 9:00"),
          takeoffTime: new Date("01-12-2024 9:20"),
          blockTime: "7:55",
          airTime: "7:30",
          landingTime: new Date("01-12-2024 18:00"),
          onBlockTime: new Date("01-12-2024 18:05")
        }
      },
      status: "ready"
    },
    {
      flightNumber: "LH 417",
      callsign: "DLH 1KY",
      departure: {
        icao: "EDDF",
        gate: "V101",
        name: "Frankfurt Rhein-Main",
        country: "Germany",
        timezone: "+01:00"
      },
      arrival: {
        icao: "KORD",
        gate: "C10",
        name: "Chicago O'Hare Intl",
        country: "United States of America",
        timezone: "-06:00"
      },
      aircraft: {
        icaoCode: "A333",
        shortName: "A330-300",
        fullName: "Airbus A330-300 RR",
        registration: "D-AIDA",
        selcal: "SP-LR",
        livery: "Sunshine (2024)"
      },
      timesheet: {
        scheduled: {
          offBlockTime: new Date("01-12-2024 9:00"),
          takeoffTime: new Date("01-12-2024 9:20"),
          blockTime: "7:55",
          airTime: "7:30",
          landingTime: new Date("01-12-2024 18:00"),
          onBlockTime: new Date("01-12-2024 18:05")
        }
      },
      status: "ready"
    },
    {
      flightNumber: "LH 418",
      callsign: "DLH 1KY",
      departure: {
        icao: "EDDF",
        gate: "V101",
        name: "Frankfurt Rhein-Main",
        country: "Germany",
        timezone: "+01:00"
      },
      arrival: {
        icao: "KORD",
        gate: "C10",
        name: "Chicago O'Hare Intl",
        country: "United States of America",
        timezone: "-06:00"
      },
      aircraft: {
        icaoCode: "A333",
        shortName: "A330-300",
        fullName: "Airbus A330-300 RR",
        registration: "D-AIDA",
        selcal: "SP-LR",
        livery: "Sunshine (2024)"
      },
      timesheet: {
        scheduled: {
          offBlockTime: new Date("01-12-2024 9:00"),
          takeoffTime: new Date("01-12-2024 9:20"),
          blockTime: "7:55",
          airTime: "7:30",
          landingTime: new Date("01-12-2024 18:00"),
          onBlockTime: new Date("01-12-2024 18:05")
        }
      },
      status: "future"
    },
    {
      flightNumber: "LH 419",
      callsign: "DLH 1KY",
      departure: {
        icao: "EDDF",
        gate: "V101",
        name: "Frankfurt Rhein-Main",
        country: "Germany",
        timezone: "+01:00"
      },
      arrival: {
        icao: "KORD",
        gate: "C10",
        name: "Chicago O'Hare Intl",
        country: "United States of America",
        timezone: "-06:00"
      },
      aircraft: {
        icaoCode: "A333",
        shortName: "A330-300",
        fullName: "Airbus A330-300 RR",
        registration: "D-AIDA",
        selcal: "SP-LR",
        livery: "Sunshine (2024)"
      },
      timesheet: {
        scheduled: {
          offBlockTime: new Date("01-12-2024 9:00"),
          takeoffTime: new Date("01-12-2024 9:20"),
          blockTime: "7:55",
          airTime: "7:30",
          landingTime: new Date("01-12-2024 18:00"),
          onBlockTime: new Date("01-12-2024 18:05")
        }
      },
      status: "future"
    },
    {
      flightNumber: "LH 420",
      callsign: "DLH 1KY",
      departure: {
        icao: "EDDF",
        gate: "V101",
        name: "Frankfurt Rhein-Main",
        country: "Germany",
        timezone: "+01:00"
      },
      arrival: {
        icao: "KORD",
        gate: "C10",
        name: "Chicago O'Hare Intl",
        country: "United States of America",
        timezone: "-06:00"
      },
      aircraft: {
        icaoCode: "A333",
        shortName: "A330-300",
        fullName: "Airbus A330-300 RR",
        registration: "D-AIDA",
        selcal: "SP-LR",
        livery: "Sunshine (2024)"
      },
      timesheet: {
        scheduled: {
          offBlockTime: new Date("01-12-2024 9:00"),
          takeoffTime: new Date("01-12-2024 9:20"),
          blockTime: "7:55",
          airTime: "7:30",
          landingTime: new Date("01-12-2024 18:00"),
          onBlockTime: new Date("01-12-2024 18:05")
        }
      },
      status: "future"
    }
  ];
}
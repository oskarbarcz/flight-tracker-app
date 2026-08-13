import { NotamSeverity } from "~/features/notam/model";

export function translateNotamSeverity(severity: NotamSeverity): string {
  switch (severity) {
    case NotamSeverity.OutOfService:
      return "Out of service";
    case NotamSeverity.Limited:
      return "Limited";
    case NotamSeverity.Advisory:
      return "Advisory";
  }
}

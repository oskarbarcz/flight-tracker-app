import type { CreateTerminalFormData } from "~/models/form/terminal.form";
import type { CreateTerminalRequest, GetTerminalResponse } from "~/state/api/request/terminal.request";

function parseOperatorCodes(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/[\s,]+/)
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean),
    ),
  );
}

export function terminalFormDataToRequest(input: CreateTerminalFormData): CreateTerminalRequest {
  const text = input.text.trim();
  return {
    shortName: input.shortName.trim(),
    fullName: input.fullName.trim(),
    averageTaxiTime: Number(input.averageTaxiTime),
    operatorCodes: parseOperatorCodes(input.operatorCodes),
    text: text === "" ? null : text,
  };
}

export function terminalToFormData(input: GetTerminalResponse): CreateTerminalFormData {
  return {
    shortName: input.shortName,
    fullName: input.fullName,
    averageTaxiTime: input.averageTaxiTime,
    operatorCodes: input.operatorCodes.join(", "),
    text: input.text ?? "",
  };
}

import { type ObjectSchema, object, string } from "yup";
import type { CreateGateFormData } from "~/features/gate/form";
import { GateCategory } from "~/models";

export const createGateSchema: ObjectSchema<CreateGateFormData> = object().shape({
  terminalId: string().required("Terminal is required").uuid("Terminal selection is invalid"),
  name: string().required("Name is required").max(16, "Name must be at most 16 characters"),
  category: string<GateCategory>().required().oneOf(Object.values(GateCategory)),
  parkingPositionId: string()
    .default("")
    .test("uuid-or-empty", "Parking position selection is invalid", (value) => {
      if (!value) return true;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    }),
});

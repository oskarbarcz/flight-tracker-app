import React from "react";
import {
  ChangeRequestFieldRow,
  FIELD_GRID,
  VALUE_GRID,
} from "~/features/change-request/components/Review/ChangeRequestFieldRow";
import { changeRequestFieldSpec, orderChangedFields } from "~/features/change-request/lib/changeRequestFields";
import type { ChangeRequestDetail } from "~/features/change-request/model";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  detail: ChangeRequestDetail;
};

export function ChangeRequestFieldList({ detail }: Props) {
  const order = orderChangedFields(
    detail.resource,
    detail.fields.map((field) => field.field),
  );
  const fields = [...detail.fields].sort((left, right) => order.indexOf(left.field) - order.indexOf(right.field));

  return (
    <div>
      <div
        aria-hidden={true}
        className={`hidden gap-x-3 border-b border-gray-100 px-3.5 pt-2.5 pb-1.5 sm:grid dark:border-gray-800 ${FIELD_GRID}`}
      >
        <FieldLabel>Field</FieldLabel>
        <div className={`grid gap-x-3 ${VALUE_GRID}`}>
          <FieldLabel>Now</FieldLabel>
          <span />
          <FieldLabel>Proposed</FieldLabel>
        </div>
      </div>
      <dl className="divide-y divide-gray-100 dark:divide-gray-800">
        {fields.map((field) => (
          <ChangeRequestFieldRow
            key={field.field}
            field={field}
            spec={changeRequestFieldSpec(detail.resource, field.field)}
            isPending={detail.isPending}
          />
        ))}
      </dl>
    </div>
  );
}

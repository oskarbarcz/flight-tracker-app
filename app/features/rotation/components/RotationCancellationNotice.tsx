import React from "react";
import type { Rotation } from "~/features/rotation";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { MetaRow } from "~/shared/ui/Display/MetaRow";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  rotation: Rotation;
};

export function RotationCancellationNotice({ rotation }: Props) {
  return (
    <Container padding="condensed" header={<CardHeader title="Cancellation" />}>
      {rotation.cancellationReason && (
        <p className="text-sm text-gray-700 dark:text-gray-200">{rotation.cancellationReason}</p>
      )}

      <div className="flex flex-col gap-1.5">
        {rotation.canceledBy && <MetaRow label="Canceled by" value={rotation.canceledBy.name} />}
        {rotation.canceledAt && (
          <MetaRow
            label="Canceled at"
            value={
              <>
                <FormattedIcaoDate date={rotation.canceledAt} /> <FormattedIcaoTime date={rotation.canceledAt} />
              </>
            }
          />
        )}
      </div>
    </Container>
  );
}

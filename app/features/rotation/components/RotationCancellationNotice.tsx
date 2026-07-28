import React from "react";
import { FaBan } from "react-icons/fa6";
import type { Rotation } from "~/features/rotation";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { MetaRow } from "~/shared/ui/Display/MetaRow";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  rotation: Rotation;
};

export function RotationCancellationNotice({ rotation }: Props) {
  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaBan} title="Cancellation" />

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

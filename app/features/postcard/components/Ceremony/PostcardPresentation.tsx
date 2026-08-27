import React from "react";
import { PostcardImage } from "~/features/postcard/components/PostcardImage";
import type { CollectedPostcard } from "~/features/postcard/model";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  postcard: CollectedPostcard;
};

export function PostcardPresentation({ postcard }: Props) {
  return (
    <>
      <div className="flex justify-center">
        <PostcardImage
          imageUrl={postcard.imageUrl}
          cityName={postcard.city.name}
          width={postcard.width}
          height={postcard.height}
          className="inline-block h-[58vh] w-auto max-w-full rounded-xl"
        />
      </div>

      <dl className="mt-4 flex items-baseline justify-center gap-2 text-sm">
        <dt>
          <FieldLabel>Awarded</FieldLabel>
        </dt>
        <dd className="font-medium tabular-nums text-gray-700 dark:text-gray-200">
          <FormattedIcaoDate date={new Date(postcard.awardedAt)} />
        </dd>
      </dl>
    </>
  );
}

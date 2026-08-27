import { Pagination } from "flowbite-react";
import React, { useState } from "react";
import { GroupHeaderButton } from "~/features/postcard/components/GroupHeaderButton";
import { PostcardCard } from "~/features/postcard/components/PostcardCard";
import type { CountryGroup } from "~/features/postcard/lib/groupPostcards";
import type { PlacedPostcard } from "~/features/postcard/model";
import { CountryFlag } from "~/shared/ui/Display/CountryFlag";

const CARDS_PER_PAGE = 24;

type Props = {
  group: CountryGroup;
  defaultOpen: boolean;
  onZoom: (postcard: PlacedPostcard) => void;
  onReplace: (postcard: PlacedPostcard) => void;
};

export function PostcardCountryGroup({ group, defaultOpen, onZoom, onReplace }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [page, setPage] = useState(1);

  const pages = Math.max(1, Math.ceil(group.postcards.length / CARDS_PER_PAGE));
  const offset = (page - 1) * CARDS_PER_PAGE;
  const visible = group.postcards.slice(offset, offset + CARDS_PER_PAGE);

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <GroupHeaderButton
        open={open}
        onToggle={() => setOpen(!open)}
        count={group.postcards.length}
        failedCount={group.failedCount}
        label={
          <>
            <CountryFlag code={group.code} name={group.name} />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
              {group.name}
            </span>
          </>
        }
      />

      {open && (
        <div className="border-t border-gray-200 px-3.5 py-3.5 dark:border-gray-800">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {visible.map((postcard) => (
              <PostcardCard key={postcard.id} postcard={postcard} onZoom={onZoom} onReplace={onReplace} />
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-4 flex flex-col items-center gap-1.5">
              <Pagination currentPage={page} totalPages={pages} onPageChange={setPage} showIcons />
              <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                {offset + 1}–{offset + visible.length} of {group.postcards.length}
              </span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

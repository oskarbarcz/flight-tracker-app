import { ToggleSwitch } from "flowbite-react";
import { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { DiscordMessageSample } from "~/features/auth/components/DiscordMessageSample";
import type { DiscordMessages } from "~/features/auth/hooks/useDiscordMessages";
import { type DiscordMessageId, discordMessages, messagesFeature } from "~/features/auth/lib/discordFeatures";
import { prefersReducedMotion } from "~/shared/lib/reducedMotion";
import { FormSectionLabel } from "~/shared/ui/Form/FormSectionLabel";

type Props = {
  messages: DiscordMessages;
};

const UNFOLD_MS = 300;
const ARRIVAL_CURVE = "ease-[cubic-bezier(0.16,1,0.3,1)]";

export function DiscordMessagesDrawer({ messages }: Props) {
  const { settings, pending, failure, change } = messages;
  const [expanded, setExpanded] = useState<DiscordMessageId | null>(null);
  const rows = useRef(new Map<DiscordMessageId, HTMLLIElement | null>());

  function toggle(id: DiscordMessageId) {
    const opening = expanded === id ? null : id;

    setExpanded(opening);

    if (opening === null) {
      return;
    }

    const reduced = prefersReducedMotion();

    window.setTimeout(
      () => rows.current.get(opening)?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" }),
      reduced ? 0 : UNFOLD_MS,
    );
  }

  return (
    <section className="space-y-3">
      <FormSectionLabel>{messagesFeature.label}</FormSectionLabel>
      <p className="text-pretty text-xs text-gray-600 dark:text-gray-400">{messagesFeature.description}</p>

      {failure !== null && (
        <p role="alert" className="text-pretty text-xs text-red-700 dark:text-red-400">
          {failure}
        </p>
      )}

      <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
        {discordMessages.map(({ id, settings: keys, label, excerpt }) => {
          const isOpen = expanded === id;
          const panelId = `discord-message-${id}`;

          return (
            <li
              key={id}
              ref={(node) => {
                rows.current.set(id, node);
              }}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                  <p className="text-pretty text-xs text-gray-600 dark:text-gray-400">{excerpt}</p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                  <ToggleSwitch
                    checked={settings !== null && keys.every((key) => settings[key])}
                    color="indigo"
                    sizing="sm"
                    disabled={settings === null || pending}
                    aria-label={label}
                    onChange={(enabled) => change(keys, enabled)}
                  />
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    aria-label={isOpen ? `Hide the ${label} message` : `Show the ${label} message`}
                    onClick={() => toggle(id)}
                    className="cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    <FaChevronDown
                      aria-hidden
                      className={`size-3.5 transition-transform duration-300 ${ARRIVAL_CURVE} motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              <div
                id={panelId}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows] ${ARRIVAL_CURVE} motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr] duration-300" : "grid-rows-[0fr] duration-[180ms]"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`pt-3 transition-[opacity,translate] ${ARRIVAL_CURVE} motion-reduce:translate-none motion-reduce:transition-none ${
                      isOpen
                        ? "translate-y-0 opacity-100 delay-[60ms] duration-300"
                        : "-translate-y-2 opacity-0 duration-150"
                    }`}
                  >
                    <DiscordMessageSample id={id} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

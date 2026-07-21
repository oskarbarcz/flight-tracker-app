import { Label, TextInput } from "flowbite-react";
import { useField } from "formik";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaXmark } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { keywordRank, matchesKeywords } from "~/shared/lib/keywordSearch";
import { InputErrorList } from "~/shared/ui/Form/InputErrorList";
import { RequiredMark } from "~/shared/ui/Form/RequiredMark";

export type AdvancedSelectOption = {
  value: string;
  keywords: string[];
  title: string;
  subtitle?: React.ReactNode;
  selectedSubtitle?: React.ReactNode;
  avatar?: React.ReactNode;
};

type Props = {
  className?: string;
  field: string;
  label: string;
  options: AdvancedSelectOption[];
  placeholder?: string;
  required?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  maxResults?: number;
  menuMinWidth?: number;
};

export function AdvancedSelect({
  className,
  field,
  label,
  options,
  placeholder = "Select…",
  required = true,
  clearable,
  disabled = false,
  maxResults = 5,
  menuMinWidth = 320,
}: Props) {
  const [fieldProps, meta, helpers] = useField(field);
  const isError = meta.touched && meta.error;

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  const selected = useMemo(
    () => options.find((option) => option.value === fieldProps.value) ?? null,
    [options, fieldProps.value],
  );

  const showSearch = isOpen || selected === null;

  useEffect(() => {
    if (isOpen) {
      document.getElementById(field)?.focus();
    }
  }, [isOpen, field]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }
    function reposition() {
      const anchor = anchorRef.current;
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
      }
    }
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [isOpen]);

  const { results, totalMatches } = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matched = query === "" ? options : options.filter((option) => matchesKeywords(option.keywords, query));
    const ranked = [...matched].sort((a, b) => keywordRank(a.keywords, query) - keywordRank(b.keywords, query));
    return { results: ranked.slice(0, maxResults), totalMatches: matched.length };
  }, [options, search, maxResults]);

  function openForSearch() {
    if (!disabled) {
      setSearch("");
      setActiveIndex(0);
      setIsOpen(true);
    }
  }

  function commitSelection(option: AdvancedSelectOption) {
    helpers.setValue(option.value);
    helpers.setTouched(true, false);
    setSearch("");
    setIsOpen(false);
  }

  function clearSelection() {
    helpers.setValue("");
    helpers.setTouched(true, false);
    setSearch("");
    setIsOpen(false);
  }

  const isClearable = (clearable ?? !required) && !disabled && selected !== null;

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        openForSearch();
        return;
      }
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && isOpen && results[activeIndex]) {
      event.preventDefault();
      commitSelection(results[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className={twMerge("w-full mb-4 min-w-0", className)}>
      <div className="mb-2 block">
        <Label htmlFor={field} color={isError ? "failure" : undefined}>
          {label}
          {required && <RequiredMark />}
        </Label>
      </div>
      <div ref={anchorRef} className="relative">
        {showSearch ? (
          <TextInput
            id={field}
            type="text"
            autoComplete="off"
            placeholder={placeholder}
            color={isError ? "failure" : undefined}
            disabled={disabled}
            value={search}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={`${field}-listbox`}
            aria-autocomplete="list"
            onChange={(event) => {
              setSearch(event.target.value);
              setActiveIndex(0);
              setIsOpen(true);
            }}
            onFocus={() => {
              setActiveIndex(0);
              setIsOpen(true);
            }}
            onBlur={() => {
              setIsOpen(false);
              setSearch("");
              helpers.setTouched(true);
            }}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <button
            type="button"
            id={field}
            disabled={disabled}
            aria-haspopup="listbox"
            onClick={openForSearch}
            className={twMerge(
              "flex w-full items-center gap-3 rounded-lg border bg-gray-50 p-2.5 text-left focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700",
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600",
              isClearable && "pr-10",
              isError ? "border-red-500" : "border-gray-300 dark:border-gray-600",
            )}
          >
            {selected?.avatar && <span className="flex shrink-0">{selected.avatar}</span>}
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                {selected?.title}
              </span>
              {selected?.selectedSubtitle && (
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {selected.selectedSubtitle}
                </span>
              )}
            </span>
          </button>
        )}
        {isClearable && !showSearch && (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={clearSelection}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:hover:text-gray-200"
          >
            <FaXmark className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {isOpen &&
        !disabled &&
        menuPos.width > 0 &&
        createPortal(
          <div
            id={`${field}-listbox`}
            role="listbox"
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              minWidth: menuMinWidth,
              zIndex: 50,
            }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            {results.length === 0 ? (
              <div className="bg-gray-50 px-3 py-3 text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                No matches found.
              </div>
            ) : (
              results.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commitSelection(option)}
                  className={twMerge(
                    "flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left",
                    index === activeIndex && "bg-indigo-50 dark:bg-indigo-950",
                  )}
                >
                  {option.avatar && <span className="flex shrink-0">{option.avatar}</span>}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                      {option.title}
                    </span>
                    {option.subtitle && (
                      <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{option.subtitle}</span>
                    )}
                  </span>
                </button>
              ))
            )}
            {totalMatches > results.length && (
              <div className="border-t border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
                Showing {results.length} of {totalMatches} — keep typing to narrow.
              </div>
            )}
          </div>,
          document.body,
        )}
      <InputErrorList errorFocus={Boolean(isError)} errors={isError ? [meta.error as string] : []} />
    </div>
  );
}

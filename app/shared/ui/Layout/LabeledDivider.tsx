type Props = {
  label: string;
  caption?: string;
};

export function LabeledDivider({ label, caption }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
          {label}
        </span>
        <span aria-hidden className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
      {caption !== undefined && <span className="text-center text-xs text-gray-500 dark:text-gray-400">{caption}</span>}
    </div>
  );
}

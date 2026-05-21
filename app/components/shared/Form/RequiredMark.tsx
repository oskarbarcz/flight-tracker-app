type Props = {
  className?: string;
};

export function RequiredMark({ className }: Props) {
  return (
    <span aria-hidden="true" className={className ?? "text-red-500 ms-0.5 relative -top-1"}>
      *
    </span>
  );
}

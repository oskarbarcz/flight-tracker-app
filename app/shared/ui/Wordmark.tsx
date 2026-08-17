type Props = {
  className?: string;
};

export function Wordmark({ className }: Props) {
  return (
    <span className={`font-normal ${className ?? ""}`}>
      my<span className="font-bold">preflight</span>
    </span>
  );
}

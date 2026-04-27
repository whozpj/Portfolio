// Wraps numbers, percentages, and time metrics in white to highlight key data points.
const METRIC = /(~?<?[\d,]+(?:\.\d+)?(?:K\+?|\+|%|ms|s\b|min|hours?)?)/g;

export function highlight(text: string): React.ReactNode[] {
  const parts = text.split(METRIC);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-white font-medium">{part}</span>
    ) : (
      part
    )
  );
}

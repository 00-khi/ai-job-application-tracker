export function formatSalary(min: number | null, max: number | null, currency: string): string {
  const safeCurrency = currency?.trim().toUpperCase();

  const fmt = (n: number) => {
    try {
      if (!Number.isFinite(n)) {
        return "N/A";
      }

      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: safeCurrency,
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
      }).format(n);
    }
  };

  const hasMin = min != null;
  const hasMax = max != null;

  if (hasMin && hasMax) return `${fmt(min)} – ${fmt(max)}`;
  if (hasMin) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

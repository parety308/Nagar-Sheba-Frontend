const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const currencyFmt = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export const formatDate = (v?: string | Date | null) =>
  v ? dateFmt.format(new Date(v)) : "—";

export const formatDateTime = (v?: string | Date | null) =>
  v ? dateTimeFmt.format(new Date(v)) : "—";

export const formatCurrency = (v?: string | number | null) =>
  v === null || v === undefined ? "—" : currencyFmt.format(Number(v));

export function formatSla(hours?: number) {
  if (!hours) return "—";
  if (hours < 48) return `${hours} hours`;
  const days = Math.round(hours / 24);
  return `${days} days`;
}

export function toEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function timeAgo(v: string | Date) {
  const minutes = Math.floor((Date.now() - new Date(v).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(v);
}

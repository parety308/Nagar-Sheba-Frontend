export type StatusMeta = { label: string; className: string };

const amber =
  "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300";
const blue = "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300";
const violet =
  "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300";
const green =
  "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300";
const gray = "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300";
const red = "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300";
const cyan = "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300";

/** Request + payment + account statuses in one lookup. */
export const STATUS_META: Record<string, StatusMeta> = {
  // Request
  PENDING_PAYMENT: { label: "Pending Payment", className: amber },
  SUBMITTED: { label: "Submitted", className: blue },
  ASSIGNED: { label: "Assigned", className: violet },
  IN_PROGRESS: { label: "In Progress", className: cyan },
  RESOLVED: { label: "Resolved", className: green },
  CLOSED: { label: "Closed", className: gray },
  CANCELLED: { label: "Cancelled", className: red },
  // Payment
  PENDING: { label: "Pending", className: amber },
  COMPLETED: { label: "Completed", className: green },
  FAILED: { label: "Failed", className: red },
  REFUNDED: { label: "Refunded", className: violet },
  // Account
  ACTIVE: { label: "Active", className: green },
  BLOCKED: { label: "Blocked", className: red },
};

export const REQUEST_STATUSES = [
  "PENDING_PAYMENT",
  "SUBMITTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
] as const;

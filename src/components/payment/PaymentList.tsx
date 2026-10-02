"use client";

import { CreditCard, SearchX } from "lucide-react";
import Link from "next/link";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePayments, useUrlState } from "@/hook";
import { formatCurrency, formatDate } from "@/lib/format";
import { STATUS_META } from "@/lib/status";
import { RefundDialog } from "./RefundDialog";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...["PENDING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"].map((s) => ({
    value: s,
    label: STATUS_META[s].label,
  })),
];

const PROVIDER_OPTIONS = [
  { value: "all", label: "All providers" },
  { value: "SSLCOMMERZ", label: "SSLCommerz" },
  { value: "BKASH", label: "bKash" },
];

const PROVIDER_LABEL: Record<string, string> = {
  SSLCOMMERZ: "SSLCommerz",
  BKASH: "bKash",
};

type Props = { requestBasePath: string; canRefund?: boolean };

export function PaymentList({ requestBasePath, canRefund = false }: Props) {
  const { get, getNumber, setParams } = useUrlState();
  const page = getNumber("page", 1);
  const status = get("status", "all");
  const provider = get("provider", "all");
  const hasFilters = status !== "all" || provider !== "all";

  const { data, isLoading, isError, error, refetch } = usePayments({
    page,
    limit: 10,
    status: status === "all" ? undefined : status,
    provider: provider === "all" ? undefined : provider,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const payments = data?.data ?? [];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <FilterSelect
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(value) => setParams({ status: value })}
        />
        <FilterSelect
          label="Provider"
          value={provider}
          options={PROVIDER_OPTIONS}
          onChange={(value) => setParams({ provider: value })}
        />
        {hasFilters && (
          <Button
            variant="ghost"
            className="h-9"
            onClick={() => setParams({ status: null, provider: null })}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <RequestListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={hasFilters ? SearchX : CreditCard}
          title={
            hasFilters ? "No payments match your filters" : "No payments yet"
          }
          description={
            hasFilters
              ? "Try a different status or provider."
              : "Fees for paid services will be listed here."
          }
        />
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Request</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Created</TableHead>
                  {canRefund && (
                    <TableHead className="pr-4 text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="px-4">
                      <Link
                        href={`${requestBasePath}/${p.requestId}`}
                        className="font-mono font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {p.request?.trackingRef ?? p.requestId.slice(0, 8)}
                      </Link>
                      {p.request?.title && (
                        <p className="max-w-56 truncate text-[11px] text-muted-foreground">
                          {p.request.title}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {PROVIDER_LABEL[p.provider] ?? p.provider}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(p.amount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell>{formatDate(p.paidAt)}</TableCell>
                    <TableCell>{formatDate(p.createdAt)}</TableCell>
                    {canRefund && (
                      <TableCell className="pr-4 text-right">
                        {p.status === "COMPLETED" && (
                          <RefundDialog payment={p} />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination meta={data?.meta} />
        </>
      )}
    </div>
  );
}

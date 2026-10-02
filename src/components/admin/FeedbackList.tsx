"use client";

import { MessageSquareText, SearchX } from "lucide-react";
import Link from "next/link";
import { DepartmentFilter } from "@/components/request/DepartmentFilter";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFeedbacks, useUrlState } from "@/hook";
import { formatDate } from "@/lib/format";

const RATING_OPTIONS = [
  { value: "all", label: "All ratings" },
  ...[5, 4, 3, 2, 1].map((n) => ({
    value: String(n),
    label: `${n} star${n > 1 ? "s" : ""}`,
  })),
];

export function FeedbackList({ requestBasePath }: { requestBasePath: string }) {
  const { get, getNumber, setParams } = useUrlState();
  const page = getNumber("page", 1);
  const rating = get("rating", "all");
  const department = get("department", "all");
  const hasFilters = rating !== "all" || department !== "all";

  const { data, isLoading, isError, error, refetch } = useFeedbacks({
    page,
    limit: 10,
    rating: rating === "all" ? undefined : Number(rating),
    departmentId: department === "all" ? undefined : department,
  });

  const items = data?.data ?? [];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <DepartmentFilter />
        <FilterSelect
          label="Rating"
          value={rating}
          options={RATING_OPTIONS}
          onChange={(v) => setParams({ rating: v })}
        />
        {hasFilters && (
          <Button
            variant="ghost"
            className="h-9"
            onClick={() => setParams({ rating: null, department: null })}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <RequestListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={hasFilters ? SearchX : MessageSquareText}
          title={hasFilters ? "No feedback matches your filters" : "No feedback yet"}
          description="Citizen ratings appear here once requests are resolved."
        />
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Request</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead className="pr-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="px-4">
                      <Link
                        href={`${requestBasePath}/${f.requestId}`}
                        className="font-mono font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {f.request?.trackingRef ?? f.requestId.slice(0, 8)}
                      </Link>
                      {f.request?.title && (
                        <p className="max-w-56 truncate text-[11px] text-muted-foreground">
                          {f.request.title}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <StarRating value={f.rating} />
                    </TableCell>
                    <TableCell className="max-w-80 truncate text-muted-foreground">
                      {f.comment ?? "—"}
                    </TableCell>
                    <TableCell className="pr-4">
                      {formatDate(f.createdAt)}
                    </TableCell>
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
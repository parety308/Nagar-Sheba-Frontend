"use client";

import { ClipboardList, FilePlus, SearchX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRequests, useSearchRequests, useUrlState } from "@/hook";
import { formatCurrency, formatDate } from "@/lib/format";
import { REQUEST_STATUSES, STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";
import { DepartmentFilter } from "./DepartmentFilter";
import { RequestListSkeleton } from "./skeletons";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...REQUEST_STATUSES.map((s) => ({ value: s, label: STATUS_META[s].label })),
];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "updatedAt:desc", label: "Recently updated" },
  { value: "slaDueAt:asc", label: "Deadline soonest" },
  { value: "title:asc", label: "Title A-Z" },
];

const STAFF_ASSIGNED_OPTIONS = [
  { value: "all", label: "Whole department" },
  { value: "me", label: "Assigned to me" },
  { value: "unassigned", label: "Unassigned" },
];

const ADMIN_ASSIGNED_OPTIONS = [
  { value: "all", label: "Any" },
  { value: "unassigned", label: "Unassigned" },
];

const OVERDUE_OPTIONS = [
  { value: "all", label: "Any deadline" },
  { value: "true", label: "Overdue only" },
];

type SortBy = "createdAt" | "updatedAt" | "title" | "status" | "slaDueAt";

type Props = {
  basePath: string;
  canCreate?: boolean;
  showAssignedFilter?: boolean; // staff
  adminFilters?: boolean; // admin: department + overdue + unassigned
};

export function RequestList({
  basePath,
  canCreate = false,
  showAssignedFilter = false,
  adminFilters = false,
}: Props) {
  const { get, getNumber, setParams } = useUrlState();

  const page = getNumber("page", 1);
  const status = get("status", "all");
  const search = get("search").trim();
  const sort = get("sort", "createdAt:desc");
  const assigned = get("assigned", "all");
  const department = get("department", "all");
  const overdue = get("overdue", "all");
  const [sortBy, sortOrder] = sort.split(":") as [SortBy, "asc" | "desc"];

  const useAssigned = showAssignedFilter || adminFilters;

  const list = useRequests(
    {
      page,
      limit: 10,
      status: status === "all" ? undefined : status,
      assigned:
        useAssigned && assigned !== "all"
          ? (assigned as "me" | "unassigned")
          : undefined,
      departmentId:
        adminFilters && department !== "all" ? department : undefined,
      overdue: adminFilters && overdue === "true" ? true : undefined,
      sortBy,
      sortOrder,
    },
    !search,
  );
  const searchResults = useSearchRequests({ q: search, page, limit: 10 });

  // The search endpoint only takes q/page/limit, so it replaces the filtered list.
  const active = search ? searchResults : list;
  const requests = active.data?.data ?? [];
  const hasFilters =
    status !== "all" ||
    !!search ||
    sort !== "createdAt:desc" ||
    (useAssigned && assigned !== "all") ||
    (adminFilters && (department !== "all" || overdue !== "all"));

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <SearchInput
          placeholder="Search title or reference..."
          paramKey="search"
        />
        {useAssigned && (
          <FilterSelect
            label="Assignment"
            value={assigned}
            options={
              adminFilters ? ADMIN_ASSIGNED_OPTIONS : STAFF_ASSIGNED_OPTIONS
            }
            disabled={!!search}
            onChange={(value) => setParams({ assigned: value })}
          />
        )}
        {adminFilters && <DepartmentFilter disabled={!!search} />}
        {adminFilters && (
          <FilterSelect
            label="Deadline"
            value={overdue}
            options={OVERDUE_OPTIONS}
            disabled={!!search}
            onChange={(value) => setParams({ overdue: value })}
          />
        )}
        <FilterSelect
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          disabled={!!search}
          onChange={(value) => setParams({ status: value })}
        />
        <FilterSelect
          label="Sort by"
          value={sort}
          options={SORT_OPTIONS}
          disabled={!!search}
          onChange={(value) => setParams({ sort: value })}
        />
        {hasFilters && (
          <Button
            variant="ghost"
            className="h-9"
            onClick={() =>
              setParams({
                status: null,
                search: null,
                sort: null,
                assigned: null,
                department: null,
                overdue: null,
              })
            }
          >
            Clear
          </Button>
        )}
      </div>

      {search && (
        <p className="mb-3 text-xs text-muted-foreground">
          Showing matches for "{search}" across all statuses. Clear the search
          to filter and sort again.
        </p>
      )}

      {active.isLoading ? (
        <RequestListSkeleton />
      ) : active.isError ? (
        <ErrorState error={active.error} onRetry={() => active.refetch()} />
      ) : requests.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="No requests match your filters"
            description="Try different filters or a different search term."
          />
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No requests yet"
            description="Requests will appear here once they are filed."
            action={
              canCreate ? (
                <Link
                  href="/citizen/requests/new"
                  className={cn(buttonVariants(), "h-9 gap-2 px-4")}
                >
                  <FilePlus className="size-4" /> Create your first request
                </Link>
              ) : undefined
            }
          />
        )
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Reference</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Service</TableHead>
                  {adminFilters && <TableHead>Department</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead className="pr-4">Filed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="px-4 font-mono">
                      <Link
                        href={`${basePath}/${r.id}`}
                        className="font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {r.trackingRef}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-64 truncate">
                      {r.title}
                    </TableCell>
                    <TableCell>{r.category?.name ?? "—"}</TableCell>
                    {adminFilters && (
                      <TableCell>{r.department?.name ?? "—"}</TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={r.status} />
                        {r.isOverdue && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {r.feeCharged ? formatCurrency(r.feeCharged) : "Free"}
                    </TableCell>
                    <TableCell className="pr-4">
                      {formatDate(r.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination meta={active.data?.meta} />
        </>
      )}
    </div>
  );
}

"use client";

import { ScrollText, SearchX } from "lucide-react";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuditLogs, useUrlState } from "@/hook";
import { formatDateTime, toEnumLabel } from "@/lib/format";

const ENTITY_OPTIONS = [
  { value: "all", label: "All entities" },
  ...["User", "Department", "Category", "ServiceRequest", "Payment"].map(
    (e) => ({ value: e, label: e }),
  ),
];

const hasValue = (v: unknown) => v !== null && v !== undefined;

export function AuditLogList() {
  const { get, getNumber, setParams } = useUrlState();
  const page = getNumber("page", 1);
  const entityType = get("entityType", "all");

  const { data, isLoading, isError, error, refetch } = useAuditLogs({
    page,
    limit: 15,
    entityType: entityType === "all" ? undefined : entityType,
  });

  const logs = data?.data ?? [];

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <FilterSelect
          label="Entity"
          value={entityType}
          options={ENTITY_OPTIONS}
          onChange={(v) => setParams({ entityType: v })}
        />
        {entityType !== "all" && (
          <Button
            variant="ghost"
            className="h-9"
            onClick={() => setParams({ entityType: null })}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <RequestListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={entityType === "all" ? ScrollText : SearchX}
          title="No audit entries"
          description="Administrative changes are recorded here."
        />
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">When</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead className="pr-4">Changes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="align-top">
                    <TableCell className="px-4">
                      {formatDateTime(log.createdAt)}
                    </TableCell>
                    <TableCell>{log.actor.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {toEnumLabel(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.entityType}
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {log.entityId.slice(0, 8)}
                      </p>
                    </TableCell>
                    <TableCell className="pr-4">
                      {hasValue(log.previousValue) || hasValue(log.newValue) ? (
                        <details>
                          <summary className="cursor-pointer text-primary">
                            View
                          </summary>
                          <pre className="mt-2 max-w-72 overflow-x-auto rounded-md bg-muted p-2 text-[11px] whitespace-pre-wrap">
                            {JSON.stringify(
                              {
                                before: log.previousValue,
                                after: log.newValue,
                              },
                              null,
                              2,
                            )}
                          </pre>
                        </details>
                      ) : (
                        "—"
                      )}
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

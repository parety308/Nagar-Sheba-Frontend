"use client";

import { Ban, CircleCheck, UserCog, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
import {
  useAdminUsers,
  useProfile,
  useUpdateUserStatus,
  useUrlState,
} from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate, toEnumLabel } from "@/lib/format";
import type { AdminUser } from "@/types/admin.type";
import { CreateStaffDialog, RoleDialog } from "./UserDialogs";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "CITIZEN", label: "Citizens" },
  { value: "STAFF", label: "Staff" },
  { value: "ADMIN", label: "Admins" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "BLOCKED", label: "Blocked" },
];

function displayName(u: AdminUser) {
  return (
    u.citizenProfile?.fullName ??
    u.staffProfile?.fullName ??
    u.adminProfile?.fullName ??
    "—"
  );
}

export function UserManager() {
  const { get, getNumber, setParams } = useUrlState();
  const { data: me } = useProfile();

  const page = getNumber("page", 1);
  const role = get("role", "all");
  const status = get("status", "all");
  const search = get("search").trim();

  const { data, isLoading, isError, error, refetch } = useAdminUsers({
    page,
    limit: 10,
    role: role === "all" ? undefined : (role as AdminUser["role"]),
    status: status === "all" ? undefined : (status as AdminUser["status"]),
    search: search || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const { mutate: setStatus, isPending: statusPending } = useUpdateUserStatus();

  const [statusTarget, setStatusTarget] = useState<AdminUser | null>(null);
  const [roleTarget, setRoleTarget] = useState<AdminUser | null>(null);

  const users = data?.data ?? [];
  const hasFilters = role !== "all" || status !== "all" || !!search;
  const nextStatus = statusTarget?.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";

  const confirmStatus = () => {
    if (!statusTarget) return;
    setStatus(
      { id: statusTarget.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(
            nextStatus === "BLOCKED" ? "User blocked" : "User unblocked",
          );
          setStatusTarget(null);
        },
        onError: (err) =>
          toast.error("Could not update user", {
            description: getApiErrorMessage(err),
          }),
      },
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <SearchInput placeholder="Search by email..." paramKey="search" />
        <FilterSelect
          label="Role"
          value={role}
          options={ROLE_OPTIONS}
          onChange={(v) => setParams({ role: v })}
        />
        <FilterSelect
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={(v) => setParams({ status: v })}
        />
        {hasFilters && (
          <Button
            variant="ghost"
            className="h-9"
            onClick={() =>
              setParams({ role: null, status: null, search: null })
            }
          >
            Clear
          </Button>
        )}
        <div className="sm:ml-auto">
          <CreateStaffDialog />
        </div>
      </div>

      {isLoading ? (
        <RequestListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try a different search or filter."
        />
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const isSelf = u.id === me?.id;
                  const canBlock = u.role !== "ADMIN" && !isSelf;
                  const canChangeRole = u.role !== "CITIZEN" && !isSelf;

                  return (
                    <TableRow key={u.id}>
                      <TableCell className="px-4">
                        <p className="font-medium">{displayName(u)}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {u.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{toEnumLabel(u.role)}</Badge>
                      </TableCell>
                      <TableCell>
                        {u.staffProfile?.department.name ?? "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={u.status} />
                      </TableCell>
                      <TableCell>{formatDate(u.createdAt)}</TableCell>
                      <TableCell className="pr-4 text-right">
                        {isSelf ? (
                          <span className="text-[11px] text-muted-foreground">
                            You
                          </span>
                        ) : (
                          <div className="flex justify-end gap-1">
                            {canChangeRole && (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={`Change role of ${u.email}`}
                                onClick={() => setRoleTarget(u)}
                              >
                                <UserCog />
                              </Button>
                            )}
                            {canBlock && (
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label={
                                  u.status === "ACTIVE"
                                    ? `Block ${u.email}`
                                    : `Unblock ${u.email}`
                                }
                                onClick={() => setStatusTarget(u)}
                              >
                                {u.status === "ACTIVE" ? (
                                  <Ban className="text-destructive" />
                                ) : (
                                  <CircleCheck className="text-green-600" />
                                )}
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Pagination meta={data?.meta} />
        </>
      )}

      <ConfirmDialog
        open={!!statusTarget}
        onOpenChange={(o) => !o && setStatusTarget(null)}
        title={
          nextStatus === "BLOCKED"
            ? `Block ${statusTarget?.email}?`
            : `Unblock ${statusTarget?.email}?`
        }
        description={
          nextStatus === "BLOCKED"
            ? "They will be signed out of every request immediately and cannot log in until unblocked."
            : "They will be able to log in again."
        }
        confirmLabel={nextStatus === "BLOCKED" ? "Block user" : "Unblock user"}
        destructive={nextStatus === "BLOCKED"}
        pending={statusPending}
        onConfirm={confirmStatus}
      />

      <RoleDialog user={roleTarget} onClose={() => setRoleTarget(null)} />
    </div>
  );
}

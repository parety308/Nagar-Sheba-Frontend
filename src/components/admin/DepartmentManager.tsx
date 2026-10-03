"use client";

import { useForm } from "@tanstack/react-form";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
  useUrlState,
} from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDate } from "@/lib/format";
import type { Department } from "@/types/department.type";
import { DepartmentZodSchema } from "@/validation";

type Editing = Department | "new" | null;

function DepartmentForm({
  department,
  onDone,
}: {
  department?: Department;
  onDone: () => void;
}) {
  const create = useCreateDepartment();
  const update = useUpdateDepartment();
  const isPending = create.isPending || update.isPending;

  const handlers = {
    onSuccess: () => {
      toast.success(department ? "Department updated" : "Department created");
      onDone();
    },
    onError: (error: unknown) =>
      toast.error("Could not save department", {
        description: getApiErrorMessage(error),
      }),
  };

  const form = useForm({
    defaultValues: {
      name: department?.name ?? "",
      description: department?.description ?? "",
    },
    validators: {
      onChange: DepartmentZodSchema,
      onSubmit: DepartmentZodSchema,
    },
    onSubmit: ({ value }) => {
      const name = value.name.trim();
      const description = value.description.trim();

      if (department) {
        update.mutate(
          { id: department.id, payload: { name, description } },
          handlers,
        );
      } else {
        create.mutate(
          { name, description: description || undefined },
          handlers,
        );
      }
    },
  });

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="name">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-10"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="description">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                rows={3}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Button type="submit" disabled={isPending} className="h-10 w-full">
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" /> Saving...
          </>
        ) : department ? (
          "Save changes"
        ) : (
          "Create department"
        )}
      </Button>
    </form>
  );
}

export function DepartmentManager() {
  const { getNumber } = useUrlState();
  const page = getNumber("page", 1);

  const { data, isLoading, isError, error, refetch } = useDepartments({
    page,
    limit: 10,
    includeInactive: true,
  });
  const { mutate: remove, isPending: deleting } = useDeleteDepartment();

  const [editing, setEditing] = useState<Editing>(null);
  const [toDelete, setToDelete] = useState<Department | null>(null);

  const departments = data?.data ?? [];

  const confirmDelete = () => {
    if (!toDelete) return;
    remove(toDelete.id, {
      onSuccess: () => {
        toast.success("Department deleted");
        setToDelete(null);
      },
      onError: (err) =>
        toast.error("Could not delete department", {
          description: getApiErrorMessage(err),
        }),
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button className="h-9 gap-2" onClick={() => setEditing("new")}>
          <Plus className="size-4" /> New department
        </Button>
      </div>

      {isLoading ? (
        <RequestListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : departments.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No departments yet"
          description="Create the first department to start routing requests."
        />
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="px-4 font-medium">{d.name}</TableCell>
                    <TableCell className="max-w-72 truncate text-muted-foreground">
                      {d.description ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={d.deletedAt ? "DELETED" : "ACTIVE"}
                      />
                    </TableCell>
                    <TableCell>{formatDate(d.createdAt)}</TableCell>
                    <TableCell className="pr-4 text-right">
                      {!d.deletedAt && (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Edit ${d.name}`}
                            onClick={() => setEditing(d)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Delete ${d.name}`}
                            onClick={() => setToDelete(d)}
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>
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

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing === "new" ? "New department" : "Edit department"}
            </DialogTitle>
            <DialogDescription>
              Departments own categories and staff accounts.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <DepartmentForm
              department={editing === "new" ? undefined : editing}
              onDone={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete?.name}?`}
        description="The department is soft-deleted and disappears from public pages. Existing requests keep their history."
        confirmLabel="Delete"
        destructive
        pending={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

"use client";

import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SelectField } from "@/components/shared/SelectField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useCreateStaff, useDepartments, useUpdateUserRole } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import type { AdminUser } from "@/types/admin.type";
import { ChangeRoleZodSchema, ProvisionStaffZodSchema } from "@/validation";

type StaffRole = "STAFF" | "ADMIN";

const ROLE_OPTIONS = [
  { value: "STAFF", label: "Staff" },
  { value: "ADMIN", label: "Administrator" },
];

const TEXT_FIELDS = [
  { name: "fullName", label: "Full name", type: "text" },
  {
    name: "personalEmail",
    label: "Personal email (receives the password)",
    type: "email",
  },
  {
    name: "organizationEmail",
    label: "Organization email (login)",
    type: "email",
  },
] as const;

function useDepartmentOptions() {
  const { data } = useDepartments({ limit: 100 });
  return (data?.data ?? []).map((d) => ({ value: d.id, label: d.name }));
}

// Create staff / admin

function StaffForm({ onDone }: { onDone: () => void }) {
  const departments = useDepartmentOptions();
  const { mutate: create, isPending } = useCreateStaff();

  const form = useForm({
    defaultValues: {
      fullName: "",
      personalEmail: "",
      organizationEmail: "",
      role: "STAFF" as StaffRole,
      departmentId: "",
      title: "",
    },
    validators: { onSubmit: ProvisionStaffZodSchema },
    onSubmit: ({ value }) => {
      const isStaff = value.role === "STAFF";
      create(
        {
          fullName: value.fullName.trim(),
          personalEmail: value.personalEmail.trim(),
          organizationEmail: value.organizationEmail.trim(),
          role: value.role,
          ...(isStaff
            ? {
                departmentId: value.departmentId,
                title: value.title.trim() || undefined,
              }
            : {}),
        },
        {
          onSuccess: () => {
            toast.success("Account created", {
              description: "A temporary password was emailed to the user.",
            });
            onDone();
          },
          onError: (error) =>
            toast.error("Could not create account", {
              description: getApiErrorMessage(error),
            }),
        },
      );
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
      {TEXT_FIELDS.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <FieldLabel htmlFor={field.name}>{item.label}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type={item.type}
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
      ))}

      <form.Field name="role">
        {(field) => (
          <Field className="space-y-1.5">
            <FieldLabel htmlFor={field.name}>Role</FieldLabel>
            <SelectField
              id={field.name}
              value={field.state.value}
              options={ROLE_OPTIONS}
              onValueChange={(v) => field.handleChange(v as StaffRole)}
            />
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.values.role}>
        {(role) =>
          role === "STAFF" && (
            <>
              <form.Field name="departmentId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-1.5">
                      <FieldLabel htmlFor={field.name}>Department</FieldLabel>
                      <SelectField
                        id={field.name}
                        value={field.state.value}
                        placeholder="Choose department"
                        aria-invalid={isInvalid}
                        options={departments}
                        onValueChange={field.handleChange}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="title">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-1.5">
                      <FieldLabel htmlFor={field.name}>
                        Job title (optional)
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-10"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </>
          )
        }
      </form.Subscribe>

      <Button type="submit" disabled={isPending} className="h-10 w-full">
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" /> Creating...
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}

export function CreateStaffDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="h-9 gap-2" />}>
        <Plus className="size-4" /> Add staff
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add staff or administrator</DialogTitle>
          <DialogDescription>
            A temporary password is emailed to the personal address and must be
            changed on first login.
          </DialogDescription>
        </DialogHeader>
        <StaffForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

// Change role

function RoleForm({ user, onDone }: { user: AdminUser; onDone: () => void }) {
  const departments = useDepartmentOptions();
  const { mutate: change, isPending } = useUpdateUserRole();

  const form = useForm({
    defaultValues: {
      role: (user.role === "STAFF" ? "ADMIN" : "STAFF") as StaffRole,
      departmentId: "",
      title: "",
    },
    validators: { onSubmit: ChangeRoleZodSchema },
    onSubmit: ({ value }) => {
      change(
        {
          id: user.id,
          payload:
            value.role === "STAFF"
              ? {
                  role: "STAFF",
                  departmentId: value.departmentId,
                  title: value.title.trim() || undefined,
                }
              : { role: "ADMIN" },
        },
        {
          onSuccess: () => {
            toast.success("Role updated");
            onDone();
          },
          onError: (error) =>
            toast.error("Could not change role", {
              description: getApiErrorMessage(error),
            }),
        },
      );
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
      <form.Field name="role">
        {(field) => (
          <Field className="space-y-1.5">
            <FieldLabel htmlFor={field.name}>New role</FieldLabel>
            <SelectField
              id={field.name}
              value={field.state.value}
              options={ROLE_OPTIONS.filter((o) => o.value !== user.role)}
              onValueChange={(v) => field.handleChange(v as StaffRole)}
            />
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.values.role}>
        {(role) =>
          role === "STAFF" && (
            <>
              <form.Field name="departmentId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-1.5">
                      <FieldLabel htmlFor={field.name}>Department</FieldLabel>
                      <SelectField
                        id={field.name}
                        value={field.state.value}
                        placeholder="Choose department"
                        aria-invalid={isInvalid}
                        options={departments}
                        onValueChange={field.handleChange}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="title">
                {(field) => (
                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor={field.name}>
                      Job title (optional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-10"
                    />
                  </Field>
                )}
              </form.Field>
            </>
          )
        }
      </form.Subscribe>

      <p className="text-[11px] text-muted-foreground">
        Moving a staff member away from STAFF unassigns their open requests.
      </p>

      <Button type="submit" disabled={isPending} className="h-10 w-full">
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" /> Saving...
          </>
        ) : (
          "Change role"
        )}
      </Button>
    </form>
  );
}

export function RoleDialog({
  user,
  onClose,
}: {
  user: AdminUser | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!user} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>{user?.email}</DialogDescription>
        </DialogHeader>
        {user && <RoleForm user={user} onDone={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

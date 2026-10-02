"use client";

import { useForm } from "@tanstack/react-form";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { FieldError, FieldLabel, Field } from "@/components/ui/field";
import { SelectField } from "@/components/shared/SelectField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminUsers,
  useDepartments,
  useReassignRequest,
  useUpdateRequestStatus,
} from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { REQUEST_STATUSES, STATUS_META } from "@/lib/status";
import type { ServiceRequest } from "@/types/request.type";
import { ReassignZodSchema, StatusOverrideZodSchema } from "@/validation";

const TERMINAL = ["CLOSED", "CANCELLED"];

function ReassignForm({ request }: { request: ServiceRequest }) {
  const { data: depts } = useDepartments({ limit: 100 });
  const { data: staff } = useAdminUsers({
    role: "STAFF",
    status: "ACTIVE",
    limit: 100,
  });
  const { mutate: reassign, isPending } = useReassignRequest();

  const form = useForm({
    defaultValues: {
      departmentId: request.departmentId,
      staffId: request.assignedStaffId ?? "",
      reason: "",
    },
    validators: { onSubmit: ReassignZodSchema },
    onSubmit: ({ value }) => {
      const reason = value.reason.trim() || undefined;
      // staffId wins (the API derives the department from the staff member);
      // otherwise send the department only, which returns it to the queue.
      const payload = value.staffId
        ? { staffId: value.staffId, reason }
        : { departmentId: value.departmentId, reason };

      reassign(
        { id: request.id, payload },
        {
          onSuccess: () => toast.success("Request reassigned"),
          onError: (error) =>
            toast.error("Could not reassign", {
              description: getApiErrorMessage(error),
            }),
        },
      );
    },
  });

  const deptOptions = (depts?.data ?? []).map((d) => ({
    value: d.id,
    label: d.name,
  }));

  return (
    <form
      noValidate
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <p className="text-xs font-semibold">Reassign</p>

      <form.Field name="departmentId">
        {(field) => (
          <Field className="space-y-1.5">
            <FieldLabel htmlFor={field.name}>Department</FieldLabel>
            <SelectField
              id={field.name}
              value={field.state.value}
              options={deptOptions}
              onValueChange={(v) => {
                field.handleChange(v);
                form.setFieldValue("staffId", "");
              }}
            />
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(s) => s.values.departmentId}>
        {(departmentId) => {
          const staffOptions = (staff?.data ?? [])
            .filter((u) => u.staffProfile?.department.id === departmentId)
            .map((u) => ({
              value: u.id,
              label: u.staffProfile?.fullName ?? u.email,
            }));

          return (
            <form.Field name="staffId">
              {(field) => (
                <Field className="space-y-1.5">
                  <FieldLabel htmlFor={field.name}>Staff member</FieldLabel>
                  <SelectField
                    id={field.name}
                    value={field.state.value}
                    placeholder="Unassigned (back to queue)"
                    options={staffOptions}
                    onValueChange={field.handleChange}
                  />
                </Field>
              )}
            </form.Field>
          );
        }}
      </form.Subscribe>

      <form.Field name="reason">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>Reason (optional)</FieldLabel>
              <Textarea
                id={field.name}
                rows={2}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Button type="submit" disabled={isPending} className="h-9 w-full">
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" /> Saving...
          </>
        ) : (
          "Save assignment"
        )}
      </Button>
    </form>
  );
}

function StatusOverrideForm({ request }: { request: ServiceRequest }) {
  const { mutate: update, isPending } = useUpdateRequestStatus();

  // Cancelling is a citizen flow (it triggers the refund), and PENDING_PAYMENT
  // can only be left through a verified payment, so neither is offered here.
  const options = REQUEST_STATUSES.filter(
    (s) =>
      s !== request.status && s !== "CANCELLED" && s !== "PENDING_PAYMENT",
  ).map((s) => ({ value: s, label: STATUS_META[s].label }));

  const form = useForm({
    defaultValues: { toStatus: "", note: "" },
    validators: { onSubmit: StatusOverrideZodSchema },
    onSubmit: ({ value }) => {
      update(
        {
          id: request.id,
          payload: {
            toStatus: value.toStatus,
            note: value.note.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            toast.success("Status updated");
            form.reset();
          },
          onError: (error) =>
            toast.error("Could not update status", {
              description: getApiErrorMessage(error),
            }),
        },
      );
    },
  });

  return (
    <form
      noValidate
      className="space-y-3 border-t pt-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <p className="text-xs font-semibold">Override status</p>

      <form.Field name="toStatus">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>New status</FieldLabel>
              <SelectField
                id={field.name}
                value={field.state.value}
                placeholder="Choose status"
                options={options}
                aria-invalid={isInvalid}
                onValueChange={field.handleChange}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="note">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>Note</FieldLabel>
              <Textarea
                id={field.name}
                rows={2}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Button
        type="submit"
        variant="outline"
        disabled={isPending}
        className="h-9 w-full"
      >
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" /> Updating...
          </>
        ) : (
          "Apply override"
        )}
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Overrides are recorded in the audit log.
      </p>
    </form>
  );
}

export function AdminActions({ request }: { request: ServiceRequest }) {
  if (TERMINAL.includes(request.status)) {
    return (
      <Card>
        <CardContent className="flex items-start gap-2 text-xs text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" />
          This request is {request.status.toLowerCase()} and can no longer be
          changed.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ReassignForm request={request} />
        <StatusOverrideForm request={request} />
      </CardContent>
    </Card>
  );
}
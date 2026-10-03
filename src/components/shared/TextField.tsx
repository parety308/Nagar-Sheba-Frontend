"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ComponentProps, ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = Omit<
  ComponentProps<"input">,
  "id" | "name" | "value" | "onChange" | "onBlur"
> & {
  field: AnyFieldApi;
  label: ReactNode;
  hint?: string;
};

export function TextField({
  field,
  label,
  hint,
  className,
  ...inputProps
}: Props) {
  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const errorId = `${field.name}-error`;
  const hintId = `${field.name}-hint`;

  return (
    <Field data-invalid={invalid} className="space-y-1.5">
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : hint ? hintId : undefined}
        className={className ?? "h-10"}
        {...inputProps}
      />
      {hint && !invalid && (
        <FieldDescription id={hintId}>{hint}</FieldDescription>
      )}
      {invalid && <FieldError id={errorId} errors={field.state.meta.errors} />}
    </Field>
  );
}

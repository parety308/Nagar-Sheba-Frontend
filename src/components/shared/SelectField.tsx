"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type Props = Omit<React.ComponentProps<"select">, "onChange"> & {
  options: Option[];
  onValueChange: (value: string) => void;
  placeholder?: string;
};

export function SelectField({
  options,
  onValueChange,
  placeholder,
  className,
  ...props
}: Props) {
  return (
    <select
      {...props}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "h-10 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
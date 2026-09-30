"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useResetPassword } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { ResetPasswordZodSchema } from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: reset, isPending } = useResetPassword();

  const form = useForm({
    defaultValues: { email, otp: "", newPassword: "" },
    validators: { onSubmit: ResetPasswordZodSchema },
    onSubmit: ({ value }) => {
      reset(value, {
        onSuccess: () => {
          toast.success("Password changed", {
            description: "You can now sign in with your new password.",
          });
          router.replace("/login");
        },
        onError: (error) => {
          toast.error("Reset failed", {
            description: getApiErrorMessage(error),
          });
        },
      });
    },
  });

  if (!email) {
    return (
      <div className="w-full rounded-xl bg-card/90 p-8 text-center shadow-2xl">
        <p className="text-sm text-muted-foreground">
          No email found. Please request a reset code first.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline"
        >
          Go to forgot password
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-card/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="size-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter the code sent to{" "}
          <span className="font-medium text-foreground">{email}</span> and
          choose a new password.
        </p>
      </div>

      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="otp">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                  Verification Code
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value.replace(/\D/g, ""))
                  }
                  className="h-12 text-center text-xl tracking-[0.6em]"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="newPassword">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                  New Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="h-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" disabled={isPending} className="h-11 w-full">
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Code expired?{" "}
          <Link
            href="/forgot-password"
            className="text-primary underline-offset-4 hover:underline"
          >
            Request a new one
          </Link>
        </p>
      </form>
    </div>
  );
}
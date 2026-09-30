"use client";

import { useForm } from "@tanstack/react-form";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useVerifyEmail } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { VerifyEmailZodSchema } from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { mutate: verify, isPending } = useVerifyEmail();

  const form = useForm({
    defaultValues: { email, otp: "" },
    validators: { onSubmit: VerifyEmailZodSchema },
    onSubmit: ({ value }) => {
      verify(value, {
        onSuccess: () => {
          toast.success("Email verified", {
            description: "Your account is ready. Welcome to Nagar Sheba!",
          });
          router.replace("/citizen");
          router.refresh();
        },
        onError: (error) => {
          toast.error("Verification failed", {
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
          No email found. Please register first.
        </p>
        <Link
          href="/register"
          className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline"
        >
          Go to registration
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-card/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="size-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          Verify your email
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">{email}</span>
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
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium"
                >
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

        <Button type="submit" disabled={isPending} className="h-11 w-full">
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Verifying...
            </>
          ) : (
            "Verify & Continue"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Code expired or wrong email?{" "}
          <Link
            href="/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            Register again
          </Link>
        </p>
      </form>
    </div>
  );
}

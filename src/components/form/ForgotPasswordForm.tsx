"use client";

import { useForm } from "@tanstack/react-form";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForgotPassword } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { ForgotPasswordZodSchema } from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate: forgot, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: ForgotPasswordZodSchema },
    onSubmit: ({ value }) => {
      forgot(value, {
        onSuccess: () => {
          toast.success("Check your email", {
            description: "We sent a 6-digit reset code.",
          });
          router.push(
            `/reset-password?email=${encodeURIComponent(value.email)}`,
          );
        },
        onError: (error) => {
          toast.error("Could not send code", {
            description: getApiErrorMessage(error),
          });
        },
      });
    },
  });

  return (
    <div className="w-full rounded-xl bg-card/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="size-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">
          Forgot password?
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter your email and we'll send you a reset code.
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
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium"
                >
                  Email Address
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  autoComplete="email"
                  placeholder="citizen@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-11"
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
              Sending code...
            </>
          ) : (
            "Send reset code"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Remembered it?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useLogin } from "@/hooks";
import { LoginZodSchema } from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { mutate: login, isPending: loginPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginZodSchema,
    },
    onSubmit: ({ value }) => {
      login(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success("Welcome back!", {
              description: "You have successfully signed in.",
            });
            router.push("/");
          },
          onError: () => {
            toast.error("Unable to sign in", {
              description: "Please check your email and password.",
            });
          },
        },
      );
    },
  });

  return (
    <div className="w-full space-y-7">
      <div className="space-y-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
          <LockKeyhole className="size-6 text-primary" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Access your Nagar Sheba account and manage your city services.
          </p>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="space-y-2">
                <FieldLabel htmlFor={field.name}>Email address</FieldLabel>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    placeholder="you@example.com"
                    className="h-12 pl-10"
                  />
                </div>

                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="h-12 pr-11 pl-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            );
          }}
        </form.Field>

        <Button
          disabled={loginPending}
          type="submit"
          className="group h-12 w-full text-sm font-semibold"
        >
          {loginPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      <div className="relative flex items-center">
        <div className="h-px flex-1 bg-border" />
        <span className="px-4 text-xs text-muted-foreground">
          New to Nagar Sheba?
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" className="h-12 w-full" asChild>
        <Link href="/register">Create a new account</Link>
      </Button>

      <p className="text-center text-xs leading-5 text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="font-medium text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="font-medium text-primary hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
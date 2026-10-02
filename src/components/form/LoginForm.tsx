"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowRight,
  Badge,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  UserPlus,
  Verified,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useLogin } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { getRoleHome } from "@/lib/roles";
import type { LoginPayload } from "@/types/auth.type";
import { LoginZodSchema } from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import DemoLoginPanel from "./DemoLoginPanel";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: login, isPending: loginPending } = useLogin();

  const submitLogin = (credentials: LoginPayload) => {
    login(credentials, {
      onSuccess: (user) => {
        toast.success("Welcome Back!", {
          description: "You have successfully signed in to Nagar Sheba.",
        });

        // Only allow same-site relative redirects (prevents open redirect)
        const redirect = searchParams.get("redirect");
        const safeRedirect =
          redirect?.startsWith("/") && !redirect.startsWith("//")
            ? redirect
            : null;

        router.replace(safeRedirect ?? getRoleHome(user.role));
        router.refresh();
      },
      onError: (error) => {
        toast.error("Sign in failed", {
          description: getApiErrorMessage(
            error,
            "The credentials entered do not match our records.",
          ),
        });
      },
    });
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginZodSchema,
    },
    onSubmit: ({ value }) => {
      submitLogin({ email: value.email, password: value.password });
    },
  });
  return (
    <div className="w-full rounded-xl bg-card/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-muted p-2 shadow-inner">
            <div className="flex size-full items-center justify-center rounded-md bg-primary/10">
              <Badge className="size-6 text-primary" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">
                Citizen Sign In
              </h1>
              <Verified
                className="size-4 text-primary"
                aria-label="Secured authentication"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Access Smart City Dhaka utilities & records
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          <span className="size-1.5 animate-ping rounded-full bg-primary" />
          2.0 LIVE
        </span>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-5"
        noValidate
      >
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    Email Address
                    <span className="text-primary">*</span>
                  </span>

                  <span className="text-[10px] font-normal text-muted-foreground">
                    Registered email
                  </span>
                </FieldLabel>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="citizen@example.com"
                    className="h-11 pl-10"
                  />
                </div>

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex items-center gap-1.5 text-sm font-medium"
                  >
                    Secured Password
                    <span className="text-primary">*</span>
                  </FieldLabel>

                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary underline-offset-4 transition-colors hover:underline"
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
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="••••••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="h-11 pr-11 pl-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="flex items-center justify-end">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <KeyRound className="size-3.5" />
            Secure Login
          </span>
        </div>
        <Button
          disabled={loginPending}
          type="submit"
          className="group mt-1 h-11 w-full gap-2 text-sm font-semibold shadow-lg shadow-primary/20"
        >
          {loginPending ? (
            <>
              <Spinner data-icon="inline-start" />
              Signing in...
            </>
          ) : (
            <>
              Sign In to Nagar Sheba
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <div className="mt-2 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">
            New to Nagar Sheba?
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Link
          href="/register"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-transparent px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          <UserPlus className="size-4 text-primary" />
          Create a new citizen account
        </Link>

        <p className="mt-1 text-center text-xs leading-5 text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-foreground underline underline-offset-2 transition-colors hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-2 transition-colors hover:text-primary"
          >
            Digital Civic Privacy Policy
          </Link>
          .
        </p>
      </form>
      <DemoLoginPanel pending={loginPending} onSelect={submitLogin} />
    </div>
  );
}

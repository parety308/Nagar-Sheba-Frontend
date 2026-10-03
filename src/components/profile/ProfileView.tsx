"use client";

import { useForm } from "@tanstack/react-form";
import { Camera, Eye, EyeOff } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/shared/ErrorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ROLE_LABEL } from "@/config/navigation";
import {
  useChangePassword,
  useProfile,
  useUpdateProfile,
  useUpdateProfileImage,
} from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { getDisplayName, getInitials } from "@/lib/user";
import type { UserRole } from "@/types/auth.type";
import type { AuthUser } from "@/types/user.type";
import { ChangePasswordZodSchema, UpdateProfileZodSchema } from "@/validation";

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const DETAIL_FIELDS = [
  {
    name: "fullName",
    label: "Full name",
    autoComplete: "name",
    roles: ["CITIZEN", "STAFF", "ADMIN"],
  },
  {
    name: "phone",
    label: "Phone number",
    autoComplete: "tel",
    roles: ["CITIZEN"],
  },
  {
    name: "address",
    label: "Address",
    autoComplete: "street-address",
    roles: ["CITIZEN"],
  },
  {
    name: "title",
    label: "Job title",
    autoComplete: "organization-title",
    roles: ["STAFF"],
  },
] as const;

const PASSWORD_FIELDS = [
  {
    name: "currentPassword",
    label: "Current password",
    autoComplete: "current-password",
  },
  {
    name: "newPassword",
    label: "New password",
    autoComplete: "new-password",
  },
] as const;

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]" aria-busy="true">
      <span className="sr-only">Loading profile</span>
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="space-y-6">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileView() {
  const { data: profile, isLoading, isError, error, refetch } = useProfile();

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !profile) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
      <AvatarCard profile={profile} />
      <div className="space-y-6">
        <DetailsForm profile={profile} />
        <PasswordForm profile={profile} />
      </div>
    </div>
  );
}

function AvatarCard({ profile }: { profile: AuthUser }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUpdateProfileImage();
  const name = getDisplayName(profile);

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_IMAGES.includes(file.type)) {
      toast.error("Use a JPEG, PNG or WEBP image");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file); // field name required by the API

    upload(formData, {
      onSuccess: () => toast.success("Profile photo updated"),
      onError: (error) =>
        toast.error("Upload failed", {
          description: getApiErrorMessage(error),
        }),
    });
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-4 text-center">
        <Avatar className="size-24">
          <AvatarImage src={profile.profileImage ?? undefined} alt={name} />
          <AvatarFallback className="text-2xl">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {profile.email}
          </p>
          <p className="mt-1 text-xs font-medium tracking-widest text-primary uppercase">
            {ROLE_LABEL[profile.role]}
          </p>
          {profile.staffProfile?.department && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {profile.staffProfile.department.name}
            </p>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGES.join(",")}
          onChange={handleSelect}
          className="sr-only"
          aria-label="Upload profile photo"
        />
        <Button
          variant="outline"
          className="h-9 gap-2"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? (
            <>
              <Spinner data-icon="inline-start" /> Uploading...
            </>
          ) : (
            <>
              <Camera className="size-4" /> Change photo
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG or WEBP, up to 5 MB.
        </p>
      </CardContent>
    </Card>
  );
}

function DetailsForm({ profile }: { profile: AuthUser }) {
  const role = profile.role;
  const { mutate: save, isPending } = useUpdateProfile();

  const form = useForm({
    defaultValues: {
      fullName:
        profile.citizenProfile?.fullName ??
        profile.staffProfile?.fullName ??
        profile.adminProfile?.fullName ??
        "",
      phone: profile.citizenProfile?.phone ?? "",
      address: profile.citizenProfile?.address ?? "",
      title: profile.staffProfile?.title ?? "",
    },
    validators: {
      onChange: UpdateProfileZodSchema,
      onSubmit: UpdateProfileZodSchema,
    },
    onSubmit: ({ value }) => {
      const payload: Record<string, string> = {
        fullName: value.fullName.trim(),
      };
      if (role === "CITIZEN") {
        if (value.phone.trim()) payload.phone = value.phone.trim();
        if (value.address.trim()) payload.address = value.address.trim();
      }
      if (role === "STAFF" && value.title.trim()) {
        payload.title = value.title.trim();
      }

      save(payload, {
        onSuccess: () => toast.success("Profile updated"),
        onError: (error) =>
          toast.error("Could not update profile", {
            description: getApiErrorMessage(error),
          }),
      });
    },
  });

  const visible = DETAIL_FIELDS.filter((f) =>
    (f.roles as readonly UserRole[]).includes(role),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
        <CardDescription>
          Your email is your login and can't be changed here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Field className="space-y-1.5">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" value={profile.email} disabled className="h-10" />
          </Field>

          {visible.map((item) => (
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
                      autoComplete={item.autoComplete}
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
          ))}

          <Button type="submit" disabled={isPending} className="h-10 px-5">
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" /> Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordForm({ profile }: { profile: AuthUser }) {
  const [show, setShow] = useState(false);
  const { mutate: change, isPending } = useChangePassword();

  const form = useForm({
    defaultValues: { currentPassword: "", newPassword: "" },
    validators: {
      onChange: ChangePasswordZodSchema,
      onSubmit: ChangePasswordZodSchema,
    },
    onSubmit: ({ value }) => {
      change(value, {
        onSuccess: () => {
          toast.success("Password changed");
          form.reset();
        },
        onError: (error) =>
          toast.error("Could not change password", {
            description: getApiErrorMessage(error),
          }),
      });
    },
  });

  if (profile.authProvider === "GOOGLE") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            You sign in with Google, so there is no password to manage here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          {profile.mustChangePassword
            ? "You are using a temporary password. Please choose your own."
            : "Use at least 6 characters with upper and lower case, a digit and a special character."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          {PASSWORD_FIELDS.map((item) => (
            <form.Field key={item.name} name={item.name}>
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name}>{item.label}</FieldLabel>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={show ? "text" : "password"}
                        autoComplete={item.autoComplete}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        aria-label={show ? "Hide passwords" : "Show passwords"}
                        className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {show ? (
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
          ))}

          <Button type="submit" disabled={isPending} className="h-10 px-5">
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" /> Updating...
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

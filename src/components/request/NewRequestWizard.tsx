"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  LocateFixed,
  SearchX,
  Send,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { UploadProgress } from "@/components/shared/UploadProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateServiceRequest } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrency, formatSla } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category.type";
import { CreateRequestZodSchema } from "@/validation";
import { LocationPreview } from "./LocationPreview";
import { PhotoPicker } from "./PhotoPicker";

type FormValues = {
  categoryId: string;
  title: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
};

const STEPS = ["Service", "Details", "Photos", "Review"] as const;
const LAST_STEP = STEPS.length - 1;

// Fields validated before the user may leave each step
const STEP_FIELDS: (keyof FormValues)[][] = [
  ["categoryId"],
  ["title", "description", "address", "latitude", "longitude"],
  [],
  [],
];

const shape = CreateRequestZodSchema.shape;

const isCoordinate = (lat: string, lng: string) =>
  lat.trim() !== "" &&
  lng.trim() !== "" &&
  Number.isFinite(Number(lat)) &&
  Number.isFinite(Number(lng)) &&
  Math.abs(Number(lat)) <= 90 &&
  Math.abs(Number(lng)) <= 180;

type Props = { categories: Category[]; initialCategoryId?: string };

export default function NewRequestWizard({
  categories,
  initialCategoryId,
}: Props) {
  const router = useRouter();
  const preselected = categories.find((c) => c.id === initialCategoryId)?.id;

  const [step, setStep] = useState(preselected ? 1 : 0);
  const [progress, setProgress] = useState(0);
  const { mutate: create, isPending } = useCreateServiceRequest();

  const [files, setFiles] = useState<File[]>([]);

  const reviewPreviews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () => {
      for (const p of reviewPreviews) URL.revokeObjectURL(p.url);
    },
    [reviewPreviews],
  );
  const groupedCategories = useMemo(() => {
    const groups = new Map<string, Category[]>();
    for (const c of categories) {
      const key = c.department?.name ?? "Other";
      groups.set(key, [...(groups.get(key) ?? []), c]);
    }
    return [...groups.entries()];
  }, [categories]);

  const form = useForm({
    defaultValues: {
      categoryId: preselected ?? "",
      title: "",
      description: "",
      address: "",
      latitude: "",
      longitude: "",
    } satisfies FormValues,
    validators: { onSubmit: CreateRequestZodSchema },
    onSubmit: ({ value }) => {
      const formData = new FormData();
      formData.append("categoryId", value.categoryId);
      formData.append("title", value.title.trim());
      formData.append("description", value.description.trim());
      formData.append("address", value.address.trim());
      formData.append("latitude", value.latitude.trim());
      formData.append("longitude", value.longitude.trim());
      for (const file of files) formData.append("attachments", file);

      setProgress(0);
      create(
        { formData, onProgress: setProgress },
        {
          onSuccess: ({ data: created }) => {
            const checkoutUrl = created.paymentSession?.checkoutUrl;

            if (checkoutUrl) {
              toast.success("Request created", {
                description: "Redirecting you to the payment page...",
              });
              window.location.assign(checkoutUrl);
              return;
            }

            if (created.status === "PENDING_PAYMENT") {
              toast.warning("Request created, payment not started", {
                description: "Open the request and choose a payment method.",
              });
            } else {
              toast.success("Request submitted", {
                description: `Your tracking reference is ${created.trackingRef}.`,
              });
            }
            router.replace(`/citizen/requests/${created.id}`);
          },
          onError: (error) => {
            toast.error("Could not create request", {
              description: getApiErrorMessage(error),
            });
          },
        },
      );
    },
  });

  const goNext = async () => {
    let valid = true;

    for (const name of STEP_FIELDS[step]) {
      form.setFieldMeta(name, (meta) => ({ ...meta, isTouched: true }));
      const errors = await form.validateField(name, "change");
      if (errors.length > 0) valid = false;
    }

    if (valid) setStep((s) => Math.min(s + 1, LAST_STEP));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location is not supported by this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setFieldValue("latitude", pos.coords.latitude.toFixed(6));
        form.setFieldValue("longitude", pos.coords.longitude.toFixed(6));
        toast.success("Location captured");
      },
      () =>
        toast.error("Could not get your location", {
          description: "Allow location access or enter coordinates manually.",
        }),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No services available"
        description="There are no active services right now. Please try again later."
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Step indicator */}
      <ol className="mb-8 flex items-center gap-2" aria-label="Progress">
        {STEPS.map((label, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className="flex flex-1 items-center gap-2"
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  done && "border-primary bg-primary text-primary-foreground",
                  current && "border-primary text-primary",
                  !done && !current && "text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {index < LAST_STEP && <span className="h-px flex-1 bg-border" />}
            </li>
          );
        })}
      </ol>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          // Enter inside an input must advance the wizard, not submit early
          if (step < LAST_STEP) {
            goNext();
            return;
          }
          form.handleSubmit();
        }}
        className="rounded-xl border bg-card p-5 sm:p-7"
      >
        {/* All steps stay mounted (hidden) so values and validation persist */}

        {/* Step 1: service */}
        <section className={cn("space-y-6", step !== 0 && "hidden")}>
          <div>
            <h2 className="text-lg font-semibold">Choose a service</h2>
            <p className="text-sm text-muted-foreground">
              Fees and resolution times are shown before you commit.
            </p>
          </div>

          <form.Field
            name="categoryId"
            validators={{ onChange: shape.categoryId }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <div className="space-y-5">
                  {groupedCategories.map(([department, items]) => (
                    <div key={department}>
                      <h3 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                        {department}
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {items.map((c) => {
                          const selected = field.state.value === c.id;
                          const paid = c.feeType === "PAID";
                          return (
                            <button
                              key={c.id}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => field.handleChange(c.id)}
                              className={cn(
                                "rounded-lg border p-4 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                                selected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "hover:bg-muted",
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-semibold">
                                  {c.name}
                                </span>
                                <Badge variant={paid ? "default" : "secondary"}>
                                  {paid ? formatCurrency(c.feeAmount) : "Free"}
                                </Badge>
                              </div>
                              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="size-3.5" />
                                Resolved within {formatSla(c.slaHours)}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              );
            }}
          </form.Field>
        </section>

        {/* Step 2: details and location */}
        <section className={cn("space-y-5", step !== 1 && "hidden")}>
          <div>
            <h2 className="text-lg font-semibold">Describe the problem</h2>
            <p className="text-sm text-muted-foreground">
              The more precise you are, the faster the team can act.
            </p>
          </div>

          <form.Field name="title" validators={{ onChange: shape.title }}>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-1.5">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    Title <span className="text-primary">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. Deep pothole near Agrabad bus stop"
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

          <form.Field
            name="description"
            validators={{ onChange: shape.description }}
          >
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-1.5">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    Description <span className="text-primary">*</span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={5}
                    placeholder="What happened, since when, and how does it affect people?"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-32"
                  />
                  <div className="flex justify-between gap-3">
                    <div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {field.state.value.length} / 2000
                    </span>
                  </div>
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="address" validators={{ onChange: shape.address }}>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-1.5">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-sm font-medium"
                  >
                    Address <span className="text-primary">*</span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    autoComplete="street-address"
                    placeholder="House, road, area"
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

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">
                Location <span className="text-primary">*</span>
              </p>
              <Button
                type="button"
                variant="outline"
                className="h-8 gap-1.5"
                onClick={useMyLocation}
              >
                <LocateFixed className="size-3.5" /> Use my location
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field
                name="latitude"
                validators={{ onChange: shape.latitude }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-1.5">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs text-muted-foreground"
                      >
                        Latitude
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        inputMode="decimal"
                        placeholder="22.324500"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-11"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field
                name="longitude"
                validators={{ onChange: shape.longitude }}
              >
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-1.5">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs text-muted-foreground"
                      >
                        Longitude
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        inputMode="decimal"
                        placeholder="91.811600"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-11"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <form.Subscribe
              selector={(s) => [s.values.latitude, s.values.longitude]}
            >
              {([lat, lng]) =>
                isCoordinate(lat, lng) ? (
                  <LocationPreview
                    latitude={Number(lat)}
                    longitude={Number(lng)}
                  />
                ) : null
              }
            </form.Subscribe>
          </div>
        </section>

        {/* Step 3: photos */}
        <section className={cn("space-y-4", step !== 2 && "hidden")}>
          <div>
            <h2 className="text-lg font-semibold">Add photos (optional)</h2>
            <p className="text-sm text-muted-foreground">
              Photos help crews find and fix the problem faster.
            </p>
          </div>
          <PhotoPicker files={files} onChange={setFiles} disabled={isPending} />
        </section>

        {/* Step 4: review */}
        <section className={cn("space-y-5", step !== 3 && "hidden")}>
          <div>
            <h2 className="text-lg font-semibold">Review and submit</h2>
            <p className="text-sm text-muted-foreground">
              Check everything before sending it to the department.
            </p>
          </div>

          <form.Subscribe selector={(s) => s.values}>
            {(values) => {
              const category = categories.find(
                (c) => c.id === values.categoryId,
              );
              const paid = category?.feeType === "PAID";

              return (
                <div className="space-y-5">
                  <dl className="divide-y rounded-lg border text-sm">
                    {[
                      ["Service", category?.name ?? "—"],
                      ["Department", category?.department?.name ?? "—"],
                      ["Title", values.title],
                      ["Description", values.description],
                      ["Address", values.address],
                      [
                        "Coordinates",
                        `${values.latitude}, ${values.longitude}`,
                      ],
                      [
                        "Fee",
                        paid ? formatCurrency(category?.feeAmount) : "Free",
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr]"
                      >
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="font-medium break-words whitespace-pre-line">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {reviewPreviews.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {reviewPreviews.map((p, index) => (
                        <div
                          key={`${p.file.name}-${p.file.lastModified}-${index}`}
                          className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                        >
                          <Image
                            src={p.url}
                            alt={p.file.name}
                            fill
                            unoptimized
                            sizes="96px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {paid && (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                      This is a paid service. After you submit, you will be
                      taken to SSLCommerz to pay{" "}
                      {formatCurrency(category?.feeAmount)}. Work starts once
                      the payment is verified.
                    </p>
                  )}
                </div>
              );
            }}
          </form.Subscribe>

          {isPending && files.length > 0 && (
            <UploadProgress percent={progress} />
          )}
        </section>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
          <Button
            type="button"
            variant="outline"
            className="h-10 gap-1.5 px-4"
            disabled={step === 0 || isPending}
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>

          {step < LAST_STEP ? (
            <Button type="submit" className="h-10 gap-1.5 px-5">
              Next <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 gap-1.5 px-5"
            >
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4" /> Submit request
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

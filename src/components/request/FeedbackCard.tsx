"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFeedback, useFeedback } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ServiceRequest } from "@/types/request.type";
import { FeedbackZodSchema } from "@/validation";

export function FeedbackCard({ request }: { request: ServiceRequest }) {
  const eligible = request.status === "RESOLVED" || request.status === "CLOSED";
  const { data: feedback, isLoading } = useFeedback(request.id, eligible);
  const { mutate: submit, isPending } = useCreateFeedback();

  const form = useForm({
    defaultValues: { rating: 0, comment: "" },
    validators: { onChange: FeedbackZodSchema, onSubmit: FeedbackZodSchema },
    onSubmit: ({ value }) => {
      submit(
        {
          requestId: request.id,
          rating: value.rating,
          comment: value.comment.trim() || undefined,
        },
        {
          onSuccess: () => toast.success("Thanks for your feedback"),
          onError: (error) =>
            toast.error("Could not submit feedback", {
              description: getApiErrorMessage(error),
            }),
        },
      );
    },
  });

  if (!eligible) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : feedback ? (
          <div className="space-y-2">
            <StarRating value={feedback.rating} />
            {feedback.comment && (
              <p className="text-sm text-muted-foreground">
                {feedback.comment}
              </p>
            )}
          </div>
        ) : (
          <form
            noValidate
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field name="rating">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium">
                      How was the resolution?
                    </p>
                    <StarRating
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="comment">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel htmlFor={field.name}>
                      Comment (optional)
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={3}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <Button type="submit" disabled={isPending} className="h-9 w-full">
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" /> Sending...
                </>
              ) : (
                "Submit feedback"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

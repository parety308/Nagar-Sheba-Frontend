"use client";

import { useForm } from "@tanstack/react-form";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useSendContactMessage } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { ContactZodSchema } from "@/validation";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

const TEXT_FIELDS = [
  {
    name: "name",
    label: "Your name",
    type: "text",
    placeholder: "Full name",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    placeholder: "How can we help?",
    autoComplete: "off",
  },
] as const;

export default function ContactForm() {
  const { mutate: send, isPending } = useSendContactMessage();

  const form = useForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    validators: { onChange: ContactZodSchema, onSubmit: ContactZodSchema },
    onSubmit: ({ value }) => {
      send(value, {
        onSuccess: () => {
          toast.success("Message sent", {
            description: "Thanks for reaching out. We'll reply by email.",
          });
          form.reset();
        },
        onError: (error) => {
          toast.error("Could not send message", {
            description: getApiErrorMessage(error),
          });
        },
      });
    },
  });

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {TEXT_FIELDS.map((item) => (
        <form.Field key={item.name} name={item.name}>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="space-y-1.5">
                <FieldLabel
                  htmlFor={field.name}
                  className="text-sm font-medium"
                >
                  {item.label} <span className="text-primary">*</span>
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type={item.type}
                  autoComplete={item.autoComplete}
                  placeholder={item.placeholder}
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
      ))}

      <form.Field name="message">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                Message <span className="text-primary">*</span>
              </FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                rows={5}
                placeholder="Tell us what you need (at least 20 characters)"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="min-h-32"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full gap-2 text-sm font-semibold"
      >
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}

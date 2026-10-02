import z from "zod";

// Coordinates stay strings in the form (inputs are text) and are validated as numbers.
const coordinate = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((value) => {
      const n = Number(value);
      return Number.isFinite(n) && n >= min && n <= max;
    }, `${label} must be a number between ${min} and ${max}.`);

export const CreateRequestZodSchema = z.object({
  categoryId: z.uuid("Please choose a service."),
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(150, "Title must not exceed 150 characters."),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters.")
    .max(2000, "Description must not exceed 2000 characters."),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters.")
    .max(255, "Address must not exceed 255 characters."),
  latitude: coordinate("Latitude", -90, 90),
  longitude: coordinate("Longitude", -180, 180),
});

export const ReopenRequestZodSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Reason must be at least 5 characters.")
    .max(500, "Reason must not exceed 500 characters."),
});

export const FeedbackZodSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Please choose a rating.")
    .max(5, "Rating must not exceed 5."),
  comment: z.string().max(1000, "Comment must not exceed 1000 characters."),
});

export const ResolveRequestZodSchema = z.object({
  note: z
    .string()
    .trim()
    .min(5, "Resolution note must be at least 5 characters.")
    .max(1000, "Note must not exceed 1000 characters."),
});

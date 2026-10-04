import z from "zod";

export const ContactZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100, "Name must not exceed 100 characters."),
  email: z.email("Please provide a valid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters.").max(150, "Subject must not exceed 150 characters."),
  message: z.string().min(20, "Message must be at least 20 characters.").max(2000, "Message must not exceed 2000 characters."),
})
import z from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long.")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
  .regex(/\d/, "Password must contain at least 1 digit.")
  .regex(
    /[@$!%*?&]/,
    "Password must contain at least 1 special character (@ $ ! % * ? &).",
  );

export const LoginZodSchema = z.object({
  email: z.email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const RegisterZodSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.email("Please provide a valid email address."),
  password: passwordSchema,
  phone: z.string().min(11, "Please provide a valid phone number."),
  address: z.string().min(3, "Address is required."),
});

export const VerifyEmailZodSchema = z.object({
  email: z.email("Please provide a valid email address."),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d+$/, "OTP must contain only numbers."),
});

export const ForgotPasswordZodSchema = z.object({
  email: z.email("Please provide a valid email address."),
});

export const ResetPasswordZodSchema = z.object({
  email: z.email("Please provide a valid email address."),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits.")
    .regex(/^\d+$/, "OTP must contain only numbers."),
  newPassword: passwordSchema,
});

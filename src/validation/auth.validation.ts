import z from "zod";

export const LoginZodSchema = z.object({
  email: z.email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const RegisterZodSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.email("Please provide a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least 1 number.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character.",
    ),
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
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least 1 number.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character.",
    ),
});

import z from "zod";

export const DepartmentZodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must not exceed 100 characters."),
  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters."),
});

// Numbers stay strings in the form (inputs are text) and are validated here.
export const CategoryZodSchema = z
  .object({
    departmentId: z.string().min(1, "Please choose a department."),
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must not exceed 100 characters."),
    feeType: z.enum(["FREE", "PAID"]),
    feeAmount: z.string().trim(),
    slaHours: z
      .string()
      .trim()
      .min(1, "SLA hours is required.")
      .refine((v) => {
        const n = Number(v);
        return Number.isInteger(n) && n >= 1 && n <= 720;
      }, "SLA must be a whole number between 1 and 720."),
  })
  .superRefine((d, ctx) => {
    if (d.feeType !== "PAID") return;
    const n = Number(d.feeAmount);
    if (!d.feeAmount || !Number.isFinite(n) || n <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["feeAmount"],
        message: "Enter a fee greater than 0 for paid services.",
      });
    }
  });

const fullName = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters.")
  .max(100, "Full name must not exceed 100 characters.");
const title = z
  .string()
  .trim()
  .max(100, "Title must not exceed 100 characters.");

export const ProvisionStaffZodSchema = z
  .object({
    fullName,
    personalEmail: z.email("Please provide a valid personal email."),
    organizationEmail: z.email("Please provide a valid organization email."),
    role: z.enum(["STAFF", "ADMIN"]),
    departmentId: z.string(),
    title,
  })
  .superRefine((d, ctx) => {
    if (d.role === "STAFF" && !d.departmentId) {
      ctx.addIssue({
        code: "custom",
        path: ["departmentId"],
        message: "Choose a department for staff accounts.",
      });
    }
  });

export const ChangeRoleZodSchema = z
  .object({
    role: z.enum(["STAFF", "ADMIN"]),
    departmentId: z.string(),
    title,
  })
  .superRefine((d, ctx) => {
    if (d.role === "STAFF" && !d.departmentId) {
      ctx.addIssue({
        code: "custom",
        path: ["departmentId"],
        message: "Choose a department for staff accounts.",
      });
    }
  });

export const ReassignZodSchema = z.object({
  departmentId: z.string().min(1, "Please choose a department."),
  staffId: z.string(),
  reason: z.string().trim().max(500, "Reason must not exceed 500 characters."),
});

export const StatusOverrideZodSchema = z
  .object({
    toStatus: z.string().min(1, "Choose a status."),
    note: z.string().trim().max(1000, "Note must not exceed 1000 characters."),
  })
  .superRefine((d, ctx) => {
    if (d.toStatus === "RESOLVED" && d.note.length < 5) {
      ctx.addIssue({
        code: "custom",
        path: ["note"],
        message: "A resolution note (5+ characters) is required to resolve.",
      });
    }
  });

export const RefundZodSchema = z.object({
  reason: z.string().trim().max(500, "Reason must not exceed 500 characters."),
});

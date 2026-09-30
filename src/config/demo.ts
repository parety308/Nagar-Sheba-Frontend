import type { UserRole } from "@/types/auth.type";

export type DemoAccount = {
  role: UserRole;
  label: string;
  description: string;
  email: string;
  password: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    label: "Admin",
    description: "Analytics, departments, staff, payments & audit logs",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
  },
  {
    role: "STAFF",
    label: "Staff",
    description: "Department queue, status updates & resolution proof",
    email: process.env.NEXT_PUBLIC_DEMO_STAFF_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_STAFF_PASSWORD ?? "",
  },
  {
    role: "CITIZEN",
    label: "Citizen",
    description: "Report issues, pay fees & track your requests",
    email: process.env.NEXT_PUBLIC_DEMO_CITIZEN_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_CITIZEN_PASSWORD ?? "",
  },
];

import type { UserRole } from "@/types/auth.type";

export const ROLE_HOME: Record<UserRole, string> = {
  CITIZEN: "/citizen",
  STAFF: "/staff",
  ADMIN: "/admin",
};

export function getRoleHome(role: UserRole) {
  return ROLE_HOME[role];
}

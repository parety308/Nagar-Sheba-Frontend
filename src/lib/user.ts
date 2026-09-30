import type { AuthUser } from "@/types/user.type";

export function getDisplayName(user?: AuthUser | null) {
  if (!user) return "";
  return (
    user.citizenProfile?.fullName ??
    user.staffProfile?.fullName ??
    user.adminProfile?.fullName ??
    user.email
  );
}

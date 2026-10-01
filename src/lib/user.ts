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

export function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "U"
  );
}

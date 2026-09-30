import type { AccountStatus, AuthProvider, UserRole } from "./auth.type";

export type AuthTokens = { accessToken: string; refreshToken: string };

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  status?: AccountStatus;
  authProvider?: AuthProvider;
  profileImage?: string | null;
  mustChangePassword?: boolean;
  citizenProfile?: {
    fullName: string;
    phone?: string;
    address?: string;
  } | null;
  staffProfile?: {
    fullName: string;
    title?: string;
    departmentId?: string;
    department?: { id: string; name: string } | null;
  } | null;
  adminProfile?: { fullName: string } | null;
};

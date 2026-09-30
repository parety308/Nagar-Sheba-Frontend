import type { AccountStatus, AuthProvider, UserRole } from "./auth.type";

export type AdminUser = {
  id: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  citizenProfile?: { fullName: string; phone: string | null } | null;
  staffProfile?: {
    fullName: string;
    title: string | null;
    department: { id: string; name: string };
  } | null;
  adminProfile?: { fullName: string } | null;
};

export type AuditLog = {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue: unknown;
  newValue: unknown;
  createdAt: string;
  actor: { id: string; email: string; role: UserRole };
};

export type DashboardStats = {
  users: { total: number; citizens: number; staff: number };
  requests: {
    total: number;
    overdue: number;
    byStatus: Record<string, number>;
  };
  payments: { totalRevenue: string | number; pending: number };
  feedback: { averageRating: number | null };
};

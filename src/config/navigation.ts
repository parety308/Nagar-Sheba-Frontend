import {
  Bell,
  Building2,
  ChartColumn,
  ClipboardList,
  CreditCard,
  FilePlus,
  LayoutDashboard,
  type LucideIcon,
  MessageSquareText,
  ScrollText,
  Tags,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { UserRole } from "@/types/auth.type";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export const ROLE_LABEL: Record<UserRole, string> = {
  CITIZEN: "Citizen",
  STAFF: "Staff",
  ADMIN: "Administrator",
};

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  CITIZEN: [
    { label: "Overview", href: "/citizen", icon: LayoutDashboard },
    { label: "My Requests", href: "/citizen/requests", icon: ClipboardList },
    { label: "New Request", href: "/citizen/requests/new", icon: FilePlus },
    { label: "Payments", href: "/citizen/payments", icon: CreditCard },
    { label: "Notifications", href: "/citizen/notifications", icon: Bell },
    { label: "Profile", href: "/citizen/profile", icon: UserRound },
  ],
  STAFF: [
    { label: "Overview", href: "/staff", icon: LayoutDashboard },
    { label: "Request Queue", href: "/staff/requests", icon: ClipboardList },
    { label: "Notifications", href: "/staff/notifications", icon: Bell },
    { label: "Profile", href: "/staff/profile", icon: UserRound },
  ],
  ADMIN: [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Requests", href: "/admin/requests", icon: ClipboardList },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
    { label: "Categories", href: "/admin/categories", icon: Tags },
    { label: "Users & Staff", href: "/admin/users", icon: Users },
    { label: "Payments", href: "/admin/payments", icon: Wallet },
    { label: "Feedback", href: "/admin/feedbacks", icon: MessageSquareText },
    { label: "Reports", href: "/admin/reports", icon: ChartColumn },
 { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Profile", href: "/admin/profile", icon: UserRound },
  ],
};

/**
 * Longest matching href wins, so "/citizen/requests/new" highlights
 * "New Request" and not also "My Requests".
 */
export function getActiveHref(pathname: string, items: NavItem[]) {
  return items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

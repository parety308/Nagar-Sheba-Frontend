"use client";

import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useProfile } from "@/hook";
import { getRoleHome } from "@/lib/roles";
import type { UserRole } from "@/types/auth.type";
import { SidebarContent } from "./Sidebar";
import { Topbar } from "./Topbar";
import { DashboardPageSkeleton } from "./DashboardPageSkeleton";

type Props = { userRole: UserRole; children: ReactNode };

export function DashboardShell({ userRole, children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: profile, isLoading } = useProfile();
const ready = !isLoading && !!profile && profile.role === userRole;
  // Second line of defence behind proxy.ts (covers expired/cleared sessions)
  useEffect(() => {
    if (isLoading) return;

    if (!profile) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (profile.role !== userRole) {
      router.replace(getRoleHome(profile.role));
    }
  }, [isLoading, profile, userRole, pathname, router]);

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
        {/* <SidebarContent role={role} /> */}
        <SidebarContent role={userRole} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="p-0 data-[side=left]:w-72 data-[side=left]:sm:max-w-72"
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SheetDescription className="sr-only">
            Dashboard navigation links
          </SheetDescription>
          <SidebarContent
            role={userRole}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <Topbar role={userRole} onMenuClick={() => setMobileOpen(true)} />

        {profile?.mustChangePassword && (
          <div
            role="alert"
            className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 sm:px-6 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
          >
            <ShieldAlert className="size-4 shrink-0" />
            <span>
              You are using a temporary password.{" "}
              <Link
                href={`${getRoleHome(userRole)}/profile`}
                className="font-semibold underline underline-offset-2"
              >
                Change it now
              </Link>
            </span>
          </div>
        )}

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
  {ready ? children : <DashboardPageSkeleton />}
</main>
      </div>
    </div>
  );
}

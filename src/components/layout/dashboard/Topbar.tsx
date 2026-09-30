"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types/auth.type";
import { NotificationBell } from "./NotificationBell";
import { UserMenu } from "./UserMenu";

type Props = { role: UserRole; onMenuClick: () => void };

export function Topbar({ role, onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <Button
        variant="ghost"
        size="icon-lg"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu />
      </Button>

      <div className="flex-1" />

      <NotificationBell role={role} />
      <UserMenu />
    </header>
  );
}

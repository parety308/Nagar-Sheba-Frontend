"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useId } from "react";
import { getActiveHref, NAV_ITEMS, ROLE_LABEL } from "@/config/navigation";
import { getRoleHome } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth.type";

type Props = { role: UserRole; onNavigate?: () => void };

export function SidebarContent({ role, onNavigate }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const uid = useId();
  const items = NAV_ITEMS[role];
  const activeHref = getActiveHref(pathname, items);

  return (
    <div className="flex h-full flex-col">
      <Link
        href={getRoleHome(role)}
        onClick={onNavigate}
        className="flex h-16 shrink-0 items-center gap-2.5 border-b px-5"
      >
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </div>
        <div className="leading-none">
          <p className="text-sm font-bold tracking-tight">Nagar Sheba</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            {ROLE_LABEL[role]} Panel
          </p>
        </div>
      </Link>

      <nav
        aria-label={`${ROLE_LABEL[role]} navigation`}
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      >
        {items.map((item) => {
          const isActive = item.href === activeHref;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative isolate flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`nav-pill-${uid}`}
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 34,
                  }}
                />
              )}

              <Icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t p-3">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            router.push("/");
            router.refresh();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4.5" />
          Back to website
        </button>
      </div>
    </div>
  );
}

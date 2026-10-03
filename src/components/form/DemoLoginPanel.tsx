"use client";

import { Rocket, ShieldCheck, UserRound, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/config/demo";
import type { LoginPayload, UserRole } from "@/types/auth.type";

const ICONS: Record<UserRole, ReactNode> = {
  ADMIN: <ShieldCheck className="size-5" />,
  STAFF: <Wrench className="size-5" />,
  CITIZEN: <UserRound className="size-5" />,
};

type Props = {
  pending: boolean;
  onSelect: (credentials: LoginPayload) => void;
};

export default function DemoLoginPanel({ pending, onSelect }: Props) {
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);

  const handleClick = (account: DemoAccount) => {
    setActiveRole(account.role);
    onSelect({ email: account.email, password: account.password });
  };

  return (
    <section aria-labelledby="demo-login-title" className="mt-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <h2
        id="demo-login-title"
        className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold"
      >
        <Rocket className="size-4 text-primary" />
        Quick Demo Login
      </h2>

      <div className="grid gap-3 sm:grid-cols-3">
        {DEMO_ACCOUNTS.map((account) => {
          const missing = !account.email || !account.password;

          return (
            <div
              key={account.role}
              className="flex flex-col gap-2 rounded-lg border bg-background p-3"
            >
              <div className="flex items-center gap-2 text-primary">
                {ICONS[account.role]}
                <span className="text-sm font-semibold text-foreground">
                  {account.label}
                </span>
              </div>

              <p className="flex-1 text-[11px] leading-4 text-muted-foreground">
                {account.description}
              </p>

              <Button
                type="button"
                variant="outline"
                disabled={pending || missing}
                title={
                  missing ? "Demo credentials not configured" : undefined
                }
                onClick={() => handleClick(account)}
                className="h-8 w-full"
              >
                {pending && activeRole === account.role ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Signing in...
                  </>
                ) : (
                  "Demo Login"
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
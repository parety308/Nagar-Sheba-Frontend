"use client";

import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLE_LABEL } from "@/config/navigation";
import { useLogOut, useProfile } from "@/hook";
import { getRoleHome } from "@/lib/roles";
import { getDisplayName } from "@/lib/user";

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "U"
  );
}

export function UserMenu() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const { mutate: logout, isPending } = useLogOut();

  if (isLoading) return <Skeleton className="size-9 rounded-full" />;
  if (!profile) return null;

  const name = getDisplayName(profile);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push("/");
        router.refresh();
      },
      onError: () =>
        toast.error("Logout failed", { description: "Please try again." }),
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="flex items-center gap-2.5 rounded-full py-1 pr-1 pl-1 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 md:pr-3"
      >
        <Avatar>
          <AvatarImage src={profile.profileImage ?? undefined} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 text-left leading-tight md:block">
          <span className="block truncate text-xs font-medium">{name}</span>
          <span className="block text-[10px] text-muted-foreground">
            {ROLE_LABEL[profile.role]}
          </span>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-2">
          <p className="truncate text-xs font-semibold">{name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {profile.email}
          </p>
          {profile.staffProfile?.department && (
            <p className="mt-1 truncate text-[11px] text-primary">
              {profile.staffProfile.department.name}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href={`${getRoleHome(profile.role)}/profile`} />}
        >
          <UserRound /> My profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={handleLogout}
        >
          <LogOut /> {isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

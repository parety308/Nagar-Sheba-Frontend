"use client";
import { Menu, ShieldCheck, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLogOut, useProfile } from "@/hook";
import { getRoleHome } from "@/lib/roles";
import { getDisplayName } from "@/lib/user";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/about-us" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: profile, isLoading: profileLoading } = useProfile();
  const { mutate: logout, isPending: logoutPending } = useLogOut();

  const isLoggedIn = !!profile;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        setMobileMenuOpen(false);
        router.push("/");
      },
      onError: () => {
        toast.error("Logout failed", {
          description: "Please try again.",
        });
      },
    });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2.5"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <ShieldCheck className="size-5" />
          </div>

          <div className="hidden leading-none sm:block">
            <p className="text-base font-bold tracking-tight">Nagar Sheba</p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Smart City Services
            </p>
          </div>

          <span className="text-base font-bold sm:hidden">Nagar Sheba</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {profileLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : isLoggedIn ? (
            <>
              <Link
                href={getRoleHome(profile.role)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <UserRound className="size-4" />
                <span className="max-w-28 truncate">
                  {getDisplayName(profile) || "Dashboard"}
                </span>
              </Link>

              <Button
                type="button"
                variant="outline"
                disabled={logoutPending}
                onClick={handleLogout}
                className="h-9"
              >
                {logoutPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t pt-4">
              {profileLoading ? (
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
              ) : isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <UserRound className="size-4" />
                    {getDisplayName(profile) || "Dashboard"}
                  </Link>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={logoutPending}
                    onClick={handleLogout}
                    className="h-10 w-full"
                  >
                    {logoutPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

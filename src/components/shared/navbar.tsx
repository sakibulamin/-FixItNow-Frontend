"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { useAuth } from "@/providers/auth-provider";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: PUBLIC_ROUTES.HOME, label: "Home" },
  { href: PUBLIC_ROUTES.SERVICES, label: "Services" },
  { href: PUBLIC_ROUTES.TECHNICIANS, label: "Technicians" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={PUBLIC_ROUTES.HOME} className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Wrench className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">FixItNow</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === PUBLIC_ROUTES.HOME
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex md:items-center md:gap-2">
            <ThemeToggle />
            {!isLoading &&
              (isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href={AUTH_ROUTES.LOGIN}>Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link href={AUTH_ROUTES.REGISTER}>Get started</Link>
                  </Button>
                </>
              ))}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="hover:bg-secondary rounded-md px-3 py-2.5 text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-2 border-t p-4">
                  {!isLoading &&
                    (isAuthenticated ? (
                      <div onClick={() => setMobileOpen(false)}>
                        <UserMenu />
                      </div>
                    ) : (
                      <>
                        <Button variant="outline" asChild>
                          <Link href={AUTH_ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                            Sign in
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link
                            href={AUTH_ROUTES.REGISTER}
                            onClick={() => setMobileOpen(false)}
                          >
                            Get started
                          </Link>
                        </Button>
                      </>
                    ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

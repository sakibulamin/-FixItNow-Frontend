"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { LogOut, Menu, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {Sheet,SheetContent,SheetHeader,SheetTitle,SheetTrigger} from "@/components/ui/sheet";
import { useAuth } from "@/providers/auth-provider";
import { cn, getInitials } from "@/lib/utils";
import { PUBLIC_ROUTES } from "@/lib/routes";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface DashboardShellProps {
  navItems: DashboardNavItem[];
  roleLabel: string;
  children: React.ReactNode;
}

function isActive(pathname: string, item: DashboardNavItem) {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function SidebarNav({
  navItems,
  pathname,
  onNavigate,
}: {
  navItems: DashboardNavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = isActive(pathname, item);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ navItems, roleLabel, children }: DashboardShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-secondary/20 flex min-h-svh">
      <aside className="bg-background sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r md:flex">
        <Link href={PUBLIC_ROUTES.HOME} className="flex items-center gap-2 px-5 py-5">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <Wrench className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">FixItNow</span>
        </Link>

        <div className="flex-1 overflow-y-auto py-2">
          <SidebarNav navItems={navItems} pathname={pathname} />
        </div>

        {user && (
          <div className="flex items-center gap-2.5 border-t p-4">
            <Avatar className="size-9">
              <AvatarImage src={user.profileImage ?? undefined} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="text-muted-foreground truncate text-xs">{roleLabel}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
              <LogOut className="size-4" />
            </Button>
          </div>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/85 sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
                      <Wrench className="size-3.5" />
                    </span>
                    FixItNow
                  </SheetTitle>
                </SheetHeader>
                <div className="py-2">
                  <SidebarNav
                    navItems={navItems}
                    pathname={pathname}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </div>
                {user && (
                  <div className="mt-auto flex items-center gap-2.5 border-t p-4">
                    <Avatar className="size-9">
                      <AvatarImage src={user.profileImage ?? undefined} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="text-muted-foreground truncate text-xs">{roleLabel}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
                      <LogOut className="size-4" />
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
            <span className="font-display font-semibold">FixItNow</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

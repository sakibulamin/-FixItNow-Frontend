"use client";

import { LayoutDashboard, Receipt, Tags, Users } from "lucide-react";

import { AuthGuard } from "@/components/shared/auth-guard";
import { DashboardShell, type DashboardNavItem } from "@/components/shared/dashboard-shell";
import { ADMIN_ROUTES } from "@/lib/routes";
import { ROLES } from "@/lib/constants";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: ADMIN_ROUTES.ROOT, label: "Overview", icon: LayoutDashboard, exact: true },
  { href: ADMIN_ROUTES.USERS, label: "Users", icon: Users },
  { href: ADMIN_ROUTES.BOOKINGS, label: "Bookings", icon: Receipt },
  { href: ADMIN_ROUTES.CATEGORIES, label: "Categories", icon: Tags },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={[ROLES.ADMIN]}>
      <DashboardShell navItems={NAV_ITEMS} roleLabel="Admin">
        {children}
      </DashboardShell>
    </AuthGuard>
  );
}

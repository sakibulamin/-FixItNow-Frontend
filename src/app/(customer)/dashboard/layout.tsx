"use client";

import { LayoutDashboard, Receipt, Settings, User, Wallet } from "lucide-react";

import { AuthGuard } from "@/components/shared/auth-guard";
import { DashboardShell, type DashboardNavItem } from "@/components/shared/dashboard-shell";
import { CUSTOMER_ROUTES } from "@/lib/routes";
import { ROLES } from "@/lib/constants";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: CUSTOMER_ROUTES.ROOT, label: "Overview", icon: LayoutDashboard, exact: true },
  { href: CUSTOMER_ROUTES.BOOKINGS, label: "Bookings", icon: Receipt },
  { href: CUSTOMER_ROUTES.PAYMENTS, label: "Payments", icon: Wallet },
  { href: CUSTOMER_ROUTES.PROFILE, label: "Profile", icon: User },
  { href: CUSTOMER_ROUTES.SETTINGS, label: "Settings", icon: Settings },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={[ROLES.CUSTOMER]}>
      <DashboardShell navItems={NAV_ITEMS} roleLabel="Customer">
        {children}
      </DashboardShell>
    </AuthGuard>
  );
}

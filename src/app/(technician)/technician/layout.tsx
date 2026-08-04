"use client";

import {CalendarClock,CalendarDays,LayoutDashboard,Star,User,Wallet,Wrench} from "lucide-react";

import { AuthGuard } from "@/components/shared/auth-guard";
import { DashboardShell, type DashboardNavItem } from "@/components/shared/dashboard-shell";
import { TECHNICIAN_ROUTES } from "@/lib/routes";
import { ROLES } from "@/lib/constants";

const NAV_ITEMS: DashboardNavItem[] = [
  { href: TECHNICIAN_ROUTES.ROOT, label: "Overview", icon: LayoutDashboard, exact: true },
  { href: TECHNICIAN_ROUTES.BOOKINGS, label: "Bookings", icon: CalendarClock },
  { href: TECHNICIAN_ROUTES.AVAILABILITY, label: "Availability", icon: CalendarDays },
  { href: TECHNICIAN_ROUTES.SERVICES, label: "Services", icon: Wrench },
  { href: TECHNICIAN_ROUTES.REVIEWS, label: "Reviews", icon: Star },
  { href: TECHNICIAN_ROUTES.EARNINGS, label: "Earnings", icon: Wallet },
  { href: TECHNICIAN_ROUTES.PROFILE, label: "Profile", icon: User },
];

export default function TechnicianDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={[ROLES.TECHNICIAN]}>
      <DashboardShell navItems={NAV_ITEMS} roleLabel="Technician">
        {children}
      </DashboardShell>
    </AuthGuard>
  );
}

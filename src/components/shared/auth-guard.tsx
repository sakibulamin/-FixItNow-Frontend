"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/providers/auth-provider";
import { AUTH_ROUTES, ROLE_HOME_ROUTE } from "@/lib/routes";
import type { Role } from "@/types/enums";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}


export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(AUTH_ROUTES.LOGIN);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(ROLE_HOME_ROUTE[user.role]);
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

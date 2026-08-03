"use client";

import * as React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AUTH_REFRESH_COOKIE,
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_COOKIE,
} from "@/lib/constants";
import { AUTH_ROUTES, ROLE_HOME_ROUTE } from "@/lib/routes";
import { getTokenExpiryDate } from "@/lib/jwt";
import { authKeys, useLoginMutation, useMeQuery, useRegisterMutation } from "@/features/auth/hooks";
import type { ApiError } from "@/types/api";
import type { LoginPayload, RegisterPayload } from "@/types/auth";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isRegistering: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: Omit<RegisterPayload, "confirmPassword">) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const COOKIE_OPTIONS = {
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [hasToken, setHasToken] = React.useState(() => {
  if (typeof window === "undefined") return false;
  return Boolean(Cookies.get(AUTH_TOKEN_COOKIE));
});

const meQuery = useMeQuery(hasToken);

  const clearSession = React.useCallback(() => {
    Cookies.remove(AUTH_TOKEN_COOKIE, { path: "/" });
    Cookies.remove(AUTH_REFRESH_COOKIE, { path: "/" });
    Cookies.remove(AUTH_ROLE_COOKIE, { path: "/" });
    setHasToken(false);
    queryClient.setQueryData(authKeys.me, null);
    queryClient.removeQueries({ queryKey: authKeys.me });
  }, [queryClient]);

  // If /auth/me fails (expired/invalid token that somehow wasn't caught by
  // the axios 401 interceptor yet), fall back to clearing local session.
  React.useEffect(() => {
  if (!meQuery.isError) return;

  const id = setTimeout(() => {
    clearSession();
  }, 0);

  return () => clearTimeout(id);
}, [meQuery.isError, clearSession]);

  const loginMutation = useLoginMutation({
    onSuccess: (data) => {
      const accessExpiry = getTokenExpiryDate(data.accessToken);
      const refreshExpiry = getTokenExpiryDate(data.refreshToken);

      Cookies.set(AUTH_TOKEN_COOKIE, data.accessToken, {
        ...COOKIE_OPTIONS,
        expires: accessExpiry,
      });
      Cookies.set(AUTH_REFRESH_COOKIE, data.refreshToken, {
        ...COOKIE_OPTIONS,
        expires: refreshExpiry,
      });
      Cookies.set(AUTH_ROLE_COOKIE, data.user.role, {
        ...COOKIE_OPTIONS,
        expires: refreshExpiry,
      });

      queryClient.setQueryData(authKeys.me, data.user);
      setHasToken(true);

      toast.success(`Welcome back, ${data.user.name}`);

      const callbackUrl =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("callbackUrl")
          : null;
      router.replace(callbackUrl || ROLE_HOME_ROUTE[data.user.role]);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Login failed. Check your credentials.");
    },
  });

  const registerMutation = useRegisterMutation({
    onSuccess: () => {
      toast.success("Account created. Please log in to continue.");
      router.replace(AUTH_ROUTES.LOGIN);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });

  const login = React.useCallback(
    async (payload: LoginPayload) => {
      await loginMutation.mutateAsync(payload);
    },
    [loginMutation],
  );

  const registerUser = React.useCallback(
    async (payload: Omit<RegisterPayload, "confirmPassword">) => {
      await registerMutation.mutateAsync(payload);
    },
    [registerMutation],
  );

  const logout = React.useCallback(() => {
    clearSession();
    toast.success("You've been logged out.");
    router.replace(AUTH_ROUTES.LOGIN);
  }, [clearSession, router]);

  const value: AuthContextValue = {
    user: meQuery.data ?? null,
    isLoading: hasToken && meQuery.isPending,
    isAuthenticated: Boolean(meQuery.data),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    login,
    register: registerUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

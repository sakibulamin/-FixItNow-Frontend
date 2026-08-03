import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import {
  API_BASE_URL,
  AUTH_REFRESH_COOKIE,
  AUTH_ROLE_COOKIE,
  AUTH_TOKEN_COOKIE,
} from "@/lib/constants";
import type { ApiErrorResponse } from "@/types/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get(AUTH_TOKEN_COOKIE);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;

    // No confirmed /auth/refresh endpoint exists on the backend (see
    // implementation plan gap #1), so a 401 here means the session is
    // over — we clear local auth state and send the user to /login
    // rather than attempting a silent refresh we can't perform.
    if (status === 401 && typeof window !== "undefined") {
      Cookies.remove(AUTH_TOKEN_COOKIE);
      Cookies.remove(AUTH_REFRESH_COOKIE);
      Cookies.remove(AUTH_ROLE_COOKIE);

      const isAuthRoute =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";

      if (!isAuthRoute) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

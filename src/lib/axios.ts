import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import {API_BASE_URL,AUTH_REFRESH_COOKIE,AUTH_ROLE_COOKIE,AUTH_TOKEN_COOKIE,} from "@/lib/constants";
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

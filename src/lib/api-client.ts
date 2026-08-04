import type { AxiosError, AxiosRequestConfig } from "axios";
import { axiosInstance } from "@/lib/axios";
import { ApiError, type ApiErrorResponse, type ApiSuccessResponse } from "@/types/api";

function toApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (axiosError.response?.data) {
    const { message, errorSources } = axiosError.response.data;
    return new ApiError(
      message || "Something went wrong. Please try again.",
      axiosError.response.status,
      errorSources ?? [],
    );
  }

  if (axiosError.request) {
    return new ApiError(
      "Couldn't reach the server. Check your connection and try again.",
    );
  }

  return new ApiError(
    axiosError.message || "Something went wrong. Please try again.",
  );
}


export const apiClient = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.get<ApiSuccessResponse<T>>(url, config);
      return response.data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async post<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await axiosInstance.post<ApiSuccessResponse<T>>(
        url,
        body,
        config,
      );
      return response.data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async put<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await axiosInstance.put<ApiSuccessResponse<T>>(
        url,
        body,
        config,
      );
      return response.data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async patch<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await axiosInstance.patch<ApiSuccessResponse<T>>(
        url,
        body,
        config,
      );
      return response.data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await axiosInstance.delete<ApiSuccessResponse<T>>(
        url,
        config,
      );
      return response.data.data;
    } catch (error) {
      throw toApiError(error);
    }
  },
};

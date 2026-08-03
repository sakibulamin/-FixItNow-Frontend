import { QueryClient } from "@tanstack/react-query";

/**
 * Factory so each request/browser session gets its own QueryClient instance
 * (avoids leaking cached data across users during SSR, and avoids
 * recreating it on every client render since QueryProvider calls this
 * inside useState()).
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute default; overridden per-feature where needed
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const status = (error as { response?: { status?: number } })
            ?.response?.status;
          // Don't retry on client errors (4xx) — only transient/server errors.
          if (status && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

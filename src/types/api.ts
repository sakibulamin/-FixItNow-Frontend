/**
 * Matches the documented backend success envelope exactly:
 * { success: true, message: string, data: T }
 */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Matches the documented backend error envelope exactly:
 * { success: false, message: string, errorSources: [] }
 */
export interface ApiErrorSource {
  path?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorSources: ApiErrorSource[];
}

/**
 * Normalized shape our api-client throws on failure, built from
 * ApiErrorResponse plus the HTTP status for callers that need it.
 */
export class ApiError extends Error {
  public readonly status?: number;
  public readonly errorSources: ApiErrorSource[];

  constructor(message: string, status?: number, errorSources: ApiErrorSource[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorSources = errorSources;
  }
}


export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorSource {
  path?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorSources: ApiErrorSource[];
}


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

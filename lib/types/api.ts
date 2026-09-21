export type ApiSuccess<T> = {
  status: true;
  statusCode?: number;
  message: string;
  data: T;
  timestamp?: string;
};

export type ApiError = {
  status: false;
  statusCode?: number;
  message: string;
  error?: string;
  timestamp?: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export function isApiSuccess<T>(
  res: ApiResponse<T>
): res is ApiSuccess<T> {
  return res.status === true;
}
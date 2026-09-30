export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type ApiErrorItem = { path: string; message: string };

export type ApiErrorBody = {
  success: false;
  statusCode: number;
  message: string;
  errors?: ApiErrorItem[];
};

import { config } from "@/config";
import { refreshSession } from "@/lib/apiClient";
import type { ApiErrorBody } from "@/types/api.type";

/** Shaped like ofetch's FetchError so getApiErrorMessage() works unchanged. */
export class UploadError extends Error {
  statusCode: number;
  data?: ApiErrorBody;

  constructor(statusCode: number, data?: ApiErrorBody) {
    super(data?.message ?? "Upload failed");
    this.statusCode = statusCode;
    this.data = data;
  }
}

function send<T>(
  path: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${config.apiUrl}${path}`);
    xhr.withCredentials = true;
    xhr.responseType = "json";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as T);
      } else {
        reject(new UploadError(xhr.status, xhr.response ?? undefined));
      }
    };

    xhr.onerror = () =>
      reject(
        new UploadError(0, {
          success: false,
          statusCode: 0,
          message: "Network error. Check your connection and try again.",
        }),
      );

    xhr.send(formData);
  });
}

export async function postFormWithProgress<T>(
  path: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<T> {
  try {
    return await send<T>(path, formData, onProgress);
  } catch (error) {
    if (
      error instanceof UploadError &&
      error.statusCode === 401 &&
      (await refreshSession())
    ) {
      return send<T>(path, formData, onProgress);
    }
    throw error;
  }
}

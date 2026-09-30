import { type FetchError, ofetch } from "ofetch";
import { config } from "@/config";

const base = ofetch.create({
  baseURL: config.apiUrl,
  credentials: "include",
});

// Endpoints where a 401 means "wrong credentials", not "expired session"
const NO_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/google-login",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh-token",
  "/auth/logout",
];

// Single-flight: parallel 401s share one refresh call
let refreshPromise: Promise<boolean> | null = null;

function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = base("/auth/refresh-token", { method: "POST", body: {} })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

type Req = Parameters<typeof base>[0];
type Opts = Parameters<typeof base>[1];

async function request(req: Req, opts?: Opts) {
  try {
    return await base(req, opts);
  } catch (error) {
    const status = (error as FetchError).statusCode;
    const path = typeof req === "string" ? req : "";

    const canRefresh =
      status === 401 && !NO_REFRESH.some((p) => path.startsWith(p));

    if (canRefresh && (await refreshSession())) {
      return base(req, opts);
    }
    throw error;
  }
}

// Keep the original call signature so every existing api file stays unchanged
const apiClient = request as unknown as typeof base;

export default apiClient;

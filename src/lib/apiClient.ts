import { ofetch } from "ofetch";
import { config } from "@/config";

const apiClient = ofetch.create({
  baseURL: config.backendUrl,
  credentials: "include",
});

export default apiClient;

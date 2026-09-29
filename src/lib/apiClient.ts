import { ofetch } from "ofetch";
import { config } from "@/config";

const apiClient = ofetch.create({
  baseURL: config.apiUrl,
  credentials: "include",
});

export default apiClient;
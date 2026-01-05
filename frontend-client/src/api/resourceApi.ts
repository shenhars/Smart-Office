// src/api/resourceApi.ts
import { apiRequest, BASE_URL_RESOURCE } from "./apiClient";

const RESOURCE_URL = `${BASE_URL_RESOURCE}/assets`;

export const getAssets = () => apiRequest(RESOURCE_URL);
export const addAsset = (asset: { name: string; type: string }) => 
  apiRequest(RESOURCE_URL, {
    method: "POST",
    body: JSON.stringify(asset),
  });

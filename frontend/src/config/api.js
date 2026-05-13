// src/config/api.js
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost/AutoVerseProjekt/backend";
export const API_URL = rawApiUrl.replace(/\/$/, "");

export function buildApiUrl(endpoint) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_URL}${path}`;
}
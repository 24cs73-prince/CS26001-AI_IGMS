/**
 * Production API Configuration & URL Resolver.
 * Resolves API endpoints dynamically from import.meta.env.VITE_API_URL.
 */

const RAW_API_URL = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");

/**
 * Builds the full destination URL for a given API endpoint.
 * Handles both base domains (e.g. 'https://ai-igms.onrender.com') and
 * base URLs that already include '/api' (e.g. 'https://ai-igms.onrender.com/api').
 *
 * @param {string} endpoint - Relative API route (e.g. '/api/students')
 * @returns {string} Full destination URL
 */
export function buildApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (!RAW_API_URL) {
    // In local development without VITE_API_URL, use relative path (proxied by Vite) or fallback to 5000
    return cleanEndpoint;
  }

  // If RAW_API_URL ends with '/api' and cleanEndpoint starts with '/api'
  if (RAW_API_URL.endsWith("/api") && cleanEndpoint.startsWith("/api")) {
    return `${RAW_API_URL}${cleanEndpoint.slice(4)}`;
  }

  return `${RAW_API_URL}${cleanEndpoint}`;
}

/**
 * Common Authorization and Content-Type Headers helper
 */
export function getAuthHeaders() {
  const token =
    localStorage.getItem("igms.auth.token") ||
    localStorage.getItem("igms.token") ||
    localStorage.getItem("token") ||
    "";

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

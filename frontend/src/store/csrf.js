// LuxuryVillaServices/frontend/src/store/csrf.js

import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
  options.method = options.method || "GET";
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["XSRF-Token"] = Cookies.get("XSRF-TOKEN");
    console.log("🔒 Sending XSRF-Token:", Cookies.get("XSRF-TOKEN")); // Debugging
  }

  options.credentials = "include"; // Ensure cookies are sent

  const res = await fetch(url, options);

  if (res.status >= 400) {
    console.error("🚨 CSRF Fetch Error:", await res.clone().text());
    throw res;
  }

  return res;
}

// ✅ Restore CSRF Token
export async function restoreCSRF() {
  console.log("🔄 Restoring CSRF Token...");
  return csrfFetch("/api/csrf/restore");
}
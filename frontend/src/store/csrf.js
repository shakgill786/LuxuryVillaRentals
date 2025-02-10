import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
  options.method = options.method || "GET";
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] = "application/json";

    const csrfToken = Cookies.get("XSRF-TOKEN");
    if (csrfToken) {
      console.log("🔒 CSRF Token Sent:", csrfToken);
      options.headers["XSRF-Token"] = csrfToken;
    } else {
      console.warn("⚠️ No CSRF token found in cookies!");
    }
  }

  options.credentials = "include"; // Include cookies in requests

  const res = await fetch(url, options);

  if (res.status >= 400) {
    console.error("🚨 CSRF Fetch Error:", await res.clone().text());
    throw res;
  }

  return res;
}

// Fetch CSRF token from backend and store in cookies
export async function restoreCSRF() {
  console.log("🔄 Restoring CSRF Token...");
  const res = await csrfFetch("/api/csrf/restore");

  if (res.ok) {
    const data = await res.json();
    console.log("✅ CSRF Token Restored:", data["XSRF-Token"]);
  } else {
    console.error("❌ Failed to restore CSRF token");
  }
}
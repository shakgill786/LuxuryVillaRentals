import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
  options.method = options.method || "GET";
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    
    // ✅ Ensure CSRF Token is included in every non-GET request
    const csrfToken = Cookies.get("XSRF-TOKEN");
    if (csrfToken) {
      options.headers["XSRF-Token"] = csrfToken;
      console.log("🔒 Sending XSRF-Token:", csrfToken);
    } else {
      console.warn("⚠️ No CSRF token found in cookies!");
    }
  }

  options.credentials = "include";

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
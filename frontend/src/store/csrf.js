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
      console.warn("⚠️ No CSRF token found!");
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

export async function restoreCSRF() {
  console.log("🔄 Restoring CSRF Token...");
  return csrfFetch("/api/csrf/restore");
}
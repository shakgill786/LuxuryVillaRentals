import Cookies from "js-cookie";

export async function csrfFetch(url, options = {}) {
  options.method = options.method || "GET";
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] = "application/json";

    const csrfToken = Cookies.get("XSRF-TOKEN");
    if (csrfToken) {
      console.log("🔒 Sending CSRF Token:", csrfToken);
      options.headers["XSRF-Token"] = csrfToken; // ✅ Ensure this matches the backend header
    } else {
      console.warn("⚠️ No CSRF token found in cookies!");
    }
  }

  options.credentials = "include"; // ✅ Ensure cookies are included in requests

  const res = await fetch(url, options);

  if (res.status >= 400) {
    console.error("🚨 CSRF Fetch Error:", await res.clone().text());
    throw res;
  }

  return res;
}

// ✅ Fetch CSRF token from backend and store in cookies
export async function restoreCSRF() {
  console.log("🔄 Restoring CSRF Token...");
  const res = await csrfFetch("/api/csrf/restore");

  if (res.ok) {
    const data = await res.json();
    const cookieToken = Cookies.get("XSRF-TOKEN");
    console.log("✅ Backend CSRF Token:", data["XSRF-Token"]);
    console.log("✅ Cookie CSRF Token:", cookieToken);
  } else {
    console.error("❌ Failed to restore CSRF token");
  }
}
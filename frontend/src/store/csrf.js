import Cookies from 'js-cookie';

// Custom CSRF fetch function
export async function csrfFetch(url, options = {}) {
  options.method = options.method || 'GET';
  options.headers = options.headers || {};

  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
  }

  options.credentials = "include";

  const res = await window.fetch(url, options);

  if (res.status >= 400) throw res;

  return res;
}

// Restore the CSRF token
export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}
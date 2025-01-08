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

  options.credentials = 'include';

  const res = await fetch(url, options);

  if (res.status >= 400) throw res;

  return res;
}

// Restore CSRF Token
export async function restoreCSRF() {
  const res = await csrfFetch('/api/csrf/restore');
  return res;
}
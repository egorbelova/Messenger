// src/utils/apiFetch.ts
let onUnauthorized: (() => void) | null = null;

export const setApiFetchUnauthorizedHandler = (callback: () => void) => {
  onUnauthorized = callback;
};

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  retry = true
) {
  const isFormData = options.body instanceof FormData;

  let res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && retry) {
    const refreshRes = await fetch('/api/refresh_token/', {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshRes.ok) {
      if (onUnauthorized) onUnauthorized();
      return res;
    }

    res = await apiFetch(url, options, false);
  }

  return res;
}

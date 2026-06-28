const TOKEN_KEY = 'pai_auth_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export class ApiError extends Error {
  constructor(message, status, code, details = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiFetch(url, options = {}) {
  const { token, skipAuth, ...fetchOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {})
  };

  const authToken = token ?? getStoredToken();
  if (authToken && !skipAuth) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const err = data?.error;
    throw new ApiError(
      err?.message || 'Wystąpił błąd serwera',
      response.status,
      err?.code,
      err?.details || []
    );
  }

  return data;
}

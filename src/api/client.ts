import ky from 'ky';

// Base HTTP client configured for the backend API
// - Sends cookies with every request (credentials: 'include')
// - Uses http://localhost:8080/api as the base URL
const API_BASE = (import.meta.env?.VITE_API_BASE as string | undefined) ?? '/api';

export const api = ky.create({
  prefixUrl: API_BASE,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const simpleApi = ky.create({
  prefixUrl: API_BASE,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic API envelope returned by most endpoints (except /check)
export type ApiResponse<T> = {
  message: string;
  data: T;
};

// Small helper to unwrap ApiResponse<T>
export async function unwrap<T>(promise: Promise<ApiResponse<T>>): Promise<T> {
  const res = await promise;
  return res.data;
}

// Map network/HTTP errors to a readable Error
export function toReadableError(err: unknown): Error {
  if (err instanceof Error) return err;
  try {
    return new Error(JSON.stringify(err));
  } catch {
    return new Error('Unknown error');
  }
}

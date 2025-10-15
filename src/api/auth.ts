import { api, toReadableError } from './client';
import type { ApiResponse } from './client';
import type { CheckResponse, SigninRequest, SignupRequest, UserResponse } from './types';
import { validateSigninRequest, validateSignupRequest } from './validators';

export async function signup(body: SignupRequest): Promise<ApiResponse<UserResponse>> {
  validateSignupRequest(body);
  try {
    return await api.post('signup', { json: body }).json<ApiResponse<UserResponse>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

export async function signin(body: SigninRequest): Promise<ApiResponse<UserResponse>> {
  validateSigninRequest(body);
  try {
    return await api.post('signin', { json: body }).json<ApiResponse<UserResponse>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

export async function signout(): Promise<ApiResponse<void>> {
  try {
    return await api.post('signout').json<ApiResponse<void>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

// Note: /check returns a raw CheckResponse, not wrapped in ApiResponse
export async function checkAuth(): Promise<CheckResponse> {
  try {
    return await api.get('check').json<CheckResponse>();
  } catch (err) {
    throw toReadableError(err);
  }
}

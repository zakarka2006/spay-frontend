import { api, toReadableError } from './client';
import type { ApiResponse } from './client';
import type { DeleteUserRequest } from './types';
import { validateDeleteUserRequest } from './validators';

export async function deleteUser(body: DeleteUserRequest): Promise<ApiResponse<void>> {
  validateDeleteUserRequest(body);
  try {
    return await api.delete('user/destroy', { json: body }).json<ApiResponse<void>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

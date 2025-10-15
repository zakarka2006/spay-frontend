import { api, toReadableError } from './client';
import type { ApiResponse } from './client';
import type { AddCardRequest, CardResponse } from './types';
import { validateAddCardRequest } from './validators';

export async function addCard(body: AddCardRequest): Promise<ApiResponse<CardResponse>> {
  validateAddCardRequest(body);
  try {
    return await api.post('cards/add', { json: body }).json<ApiResponse<CardResponse>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

export async function getCards(): Promise<ApiResponse<CardResponse[]>> {
  try {
    return await api.get('cards').json<ApiResponse<CardResponse[]>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

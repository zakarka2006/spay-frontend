import { api, toReadableError } from './client';
import type { ApiResponse } from './client';
import type { SubscriptionResponse } from './types';
import { validateIdAsPositiveNumber } from './validators';

export async function createSubscription(cardId: number | string): Promise<ApiResponse<SubscriptionResponse>> {
  const id = validateIdAsPositiveNumber(cardId, 'cardId');
  try {
    return await api.post(`subscription/create/${id}`).json<ApiResponse<SubscriptionResponse>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

export async function cancelSubscription(): Promise<ApiResponse<SubscriptionResponse>> {
  try {
    return await api.delete('subscription/cancel').json<ApiResponse<SubscriptionResponse>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

export async function changePaymentMethod(cardId: number | string): Promise<ApiResponse<SubscriptionResponse>> {
  const id = validateIdAsPositiveNumber(cardId, 'cardId');
  try {
    return await api.put(`subscription/change-payment-method/${id}`).json<ApiResponse<SubscriptionResponse>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

export async function getSubscription(): Promise<ApiResponse<SubscriptionResponse>> {
  try {
    return await api.get('subscription').json<ApiResponse<SubscriptionResponse>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

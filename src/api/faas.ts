import { api, toReadableError } from './client';
import type { MetricResponse } from './types';

export async function getFaas(): Promise<MetricResponse<string[]>> {
  try {
    return await api.get('faas').json<MetricResponse<string[]>>();
  } catch (err) {
    throw toReadableError(err);
  }
}

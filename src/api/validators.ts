import type { AddCardRequest, DeleteUserRequest, SigninRequest, SignupRequest } from './types';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignupRequest(req: SignupRequest): void {
  assert(req && typeof req === 'object', 'Invalid signup payload');
  assert(typeof req.username === 'string' && req.username.trim().length >= 3, 'Username must be at least 3 characters');
  assert(typeof req.email === 'string' && emailRegex.test(req.email), 'Email is invalid');
  assert(typeof req.password === 'string' && req.password.length >= 6, 'Password must be at least 6 characters');
}

export function validateSigninRequest(req: SigninRequest): void {
  assert(req && typeof req === 'object', 'Invalid signin payload');
  assert(typeof req.email === 'string' && emailRegex.test(req.email), 'Email is invalid');
  assert(typeof req.password === 'string' && req.password.length > 0, 'Password is required');
}

export function validateDeleteUserRequest(req: DeleteUserRequest): void {
  assert(req && typeof req === 'object', 'Invalid delete payload');
  // Minimal validation: require at least one field present
  const hasAnyField = Object.keys(req).length > 0;
  assert(hasAnyField, 'Delete payload must have at least one field');
  if (req.password != null) {
    assert(typeof req.password === 'string' && req.password.length > 0, 'Password cannot be empty');
  }
}

export function validateAddCardRequest(req: AddCardRequest): void {
  assert(req && typeof req === 'object', 'Invalid add-card payload');
  assert(typeof req.paymentMethodId === 'string' && req.paymentMethodId.trim().length > 0, 'paymentMethodId is required');
}

export function validateIdAsPositiveNumber(id: number | string, fieldName = 'id'): number {
  const n = typeof id === 'string' ? Number(id) : id;
  assert(Number.isFinite(n) && n > 0, `${fieldName} must be a positive number`);
  return n;
}

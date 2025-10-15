// Shared DTOs aligning with the backend contracts.
// Note: Exact shapes may vary on your server; adjust if needed.

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id?: number | string;
  username: string;
  email: string;
}

export interface CheckResponse {
  authenticated: boolean;
}

export interface DeleteUserRequest {
  // Commonly servers require a password confirmation; adjust if your API differs
  password?: string;
  // You can add other fields as needed, e.g., reason?: string
}

// Shared DTOs aligning with the backend contracts.
// Note: Exact shapes may vary on your server; adjust if needed.

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id?: number | string;
  username: string;
  email: string;
}

export interface CheckResponse {
  authenticated: boolean;
}

export interface DeleteUserRequest {
  // Commonly servers require a password confirmation; adjust if your API differs
  password?: string;
  // You can add other fields as needed, e.g., reason?: string
}

// Billing: Cards
export interface AddCardRequest {
  paymentMethodId: string;
}

export interface CardResponse {
  id: number | string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

// Billing: Subscription
export interface SubscriptionResponse {
  amount: number; // e.g., in cents
  apiKey: string;
}

// Metrics-style envelope used by /faas
export interface MetricResponse<T> {
  message: string;
  userId: number | string;
  data: T | null;
}

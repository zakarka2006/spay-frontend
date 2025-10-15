import { ref, computed } from 'vue';
import { checkAuth as apiCheck, signin as apiSignin, signup as apiSignup, signout as apiSignout } from '../api/auth';
import type { SigninRequest, SignupRequest, UserResponse } from '../api/types';
import { unwrap } from '../api/client';

const STORAGE_KEY = 'auth.user';

function canUseStorage() {
  try {
    if (typeof window === 'undefined') return false;
    const testKey = '__t__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function loadUserFromStorage(): UserResponse | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserResponse | null;
    if (parsed && typeof parsed === 'object' && typeof (parsed as any).username === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveUserToStorage(u: UserResponse | null) {
  if (!canUseStorage()) return;
  try {
    if (u) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

const isAuthenticated = ref<boolean>(false);
const user = ref<UserResponse | null>(null);
const checking = ref<boolean>(false);
let hasCheckedOnce = false;

// Pre-hydrate user from storage so UI can show username immediately if session is still valid
const cachedUser = loadUserFromStorage();
if (cachedUser) {
  user.value = cachedUser;
}

async function ensureAuthChecked(): Promise<boolean> {
  if (hasCheckedOnce) return isAuthenticated.value;
  checking.value = true;
  try {
    const res = await apiCheck();
    isAuthenticated.value = !!res.authenticated;
    // Reconcile local cache with server auth status
    if (!isAuthenticated.value) {
      user.value = null;
      saveUserToStorage(null);
    } else if (isAuthenticated.value && !user.value) {
      // If authenticated but user not in memory, try restore from storage
      const restored = loadUserFromStorage();
      if (restored) user.value = restored;
    }
    hasCheckedOnce = true;
    return isAuthenticated.value;
  } catch {
    isAuthenticated.value = false;
    user.value = null;
    saveUserToStorage(null);
    hasCheckedOnce = true;
    return false;
  } finally {
    checking.value = false;
  }
}

async function login(payload: SigninRequest): Promise<UserResponse> {
  const data = await unwrap(apiSignin(payload));
  user.value = data;
  saveUserToStorage(data);
  isAuthenticated.value = true;
  return data;
}

async function register(payload: SignupRequest): Promise<UserResponse> {
  // Perform signup then sign in to ensure session is established
  await unwrap(apiSignup(payload));
  const data = await unwrap(apiSignin({ email: payload.email, password: payload.password }));
  user.value = data;
  saveUserToStorage(data);
  isAuthenticated.value = true;
  return data;
}

async function logout(): Promise<void> {
  try {
    await apiSignout();
  } catch {
    // ignore network issues on logout
  } finally {
    user.value = null;
    saveUserToStorage(null);
    isAuthenticated.value = false;
  }
}

export function useAuth() {
  return {
    isAuthenticated: computed(() => isAuthenticated.value),
    user,
    checking: computed(() => checking.value),
    ensureAuthChecked,
    login,
    register,
    logout,
  };
}

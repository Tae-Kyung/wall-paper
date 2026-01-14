import { AuthState } from '@/types';

const AUTH_KEY = 'wall-paper-auth';

export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, wallId: null, wallName: null };
  }

  const stored = sessionStorage.getItem(AUTH_KEY);
  if (!stored) {
    return { isAuthenticated: false, wallId: null, wallName: null };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return { isAuthenticated: false, wallId: null, wallName: null };
  }
}

export function setAuthState(state: AuthState): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(state));
}

export function clearAuthState(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_KEY);
}

export interface StoredAuthSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  role: string;
}

const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  userId: 'authUserId',
  role: 'authRole',
} as const;

export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';
export const AUTH_FORBIDDEN_EVENT = 'auth:forbidden';

export function readAuthSession(): StoredAuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
  const userId = localStorage.getItem(STORAGE_KEYS.userId);
  const role = localStorage.getItem(STORAGE_KEYS.role);

  if (!accessToken || !refreshToken || !userId || !role) {
    return null;
  }

  return { accessToken, refreshToken, userId, role };
}

export function writeAuthSession(session: StoredAuthSession): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.accessToken, session.accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, session.refreshToken);
  localStorage.setItem(STORAGE_KEYS.userId, session.userId);
  localStorage.setItem(STORAGE_KEYS.role, session.role);
}

export function updateStoredTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function notifySessionExpired(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
  }
}

export function notifyForbidden(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_FORBIDDEN_EVENT));
  }
}

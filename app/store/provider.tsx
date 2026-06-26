'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { hydrateAuth, logout } from './features/auth/authSlice';
import {
  AUTH_FORBIDDEN_EVENT,
  AUTH_SESSION_EXPIRED_EVENT,
  readAuthSession,
} from '../services/authSession';
import { APP_TOAST_EVENT, ToastPayload, showToast } from '../services/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastPayload | null>(null);

  useEffect(() => {
    const session = readAuthSession();

    store.dispatch(hydrateAuth(
      session
        ? {
            userId: session.userId,
            token: session.accessToken,
            role: session.role,
          }
        : null,
    ));

    const handleSessionExpired = () => {
      store.dispatch(logout());
      showToast({
        title: 'Session expired',
        message: 'Please login again to continue.',
        variant: 'error',
      });
    };
    const handleForbidden = () => {
      showToast({
        title: 'Access denied',
        message: 'Your role is not allowed to perform this admin action.',
        variant: 'error',
      });
    };
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastPayload>;
      setToast(customEvent.detail);
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    window.addEventListener(AUTH_FORBIDDEN_EVENT, handleForbidden);
    window.addEventListener(APP_TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
      window.removeEventListener(AUTH_FORBIDDEN_EVENT, handleForbidden);
      window.removeEventListener(APP_TOAST_EVENT, handleToast);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const toastClasses = toast?.variant === 'error'
    ? 'border-red-200 bg-red-50 text-red-800'
    : toast?.variant === 'success'
      ? 'border-green-200 bg-green-50 text-green-800'
      : 'border-indigo-200 bg-indigo-50 text-indigo-800';

  return (
    <Provider store={store}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-lg border p-4 shadow-lg ${toastClasses}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.message && (
                <p className="mt-1 text-sm opacity-90">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              className="text-lg leading-none opacity-70 hover:opacity-100"
              onClick={() => setToast(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </Provider>
  );
}

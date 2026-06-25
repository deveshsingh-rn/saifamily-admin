'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { hydrateAuth, logout } from './features/auth/authSlice';
import {
  AUTH_SESSION_EXPIRED_EVENT,
  readAuthSession,
} from '../services/authSession';

export function Providers({ children }: { children: React.ReactNode }) {
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

    const handleSessionExpired = () => store.dispatch(logout());
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

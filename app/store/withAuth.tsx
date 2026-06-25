'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  selectAuthInitialized,
  selectIsAuthenticated,
} from './features/auth/authSlice';

const withAuth = <Props extends object>(WrappedComponent: React.ComponentType<Props>) => {
  const AuthComponent = (props: Props) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isInitialized = useSelector(selectAuthInitialized);
    const router = useRouter();

    useEffect(() => {
      if (isInitialized && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, isInitialized, router]);

    if (!isInitialized || !isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;

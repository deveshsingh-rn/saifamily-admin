'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectIsAuthenticated } from './features/auth/authSlice';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: any) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;

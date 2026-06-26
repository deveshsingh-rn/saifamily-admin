'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  AdminRole,
  selectAuthInitialized,
  selectAuthRole,
  selectIsAuthenticated,
} from './features/auth/authSlice';

const DEFAULT_ADMIN_ROLES: AdminRole[] = ['super_admin', 'mandir_admin'];

const withAuth = <Props extends object>(
  WrappedComponent: React.ComponentType<Props>,
  allowedRoles: readonly AdminRole[] = DEFAULT_ADMIN_ROLES,
) => {
  const AuthComponent = (props: Props) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isInitialized = useSelector(selectAuthInitialized);
    const role = useSelector(selectAuthRole);
    const router = useRouter();
    const isAuthorized = Boolean(role && allowedRoles.includes(role as AdminRole));

    useEffect(() => {
      if (isInitialized && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, isInitialized, router]);

    if (!isInitialized || !isAuthenticated) {
      return null;
    }

    if (!isAuthorized) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
              403 Forbidden
            </p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              Admin access required
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              Your current role does not have permission to access this admin panel.
            </p>
            <button
              type="button"
              onClick={() => router.replace('/login')}
              className="mt-5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Back to login
            </button>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;

'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  selectAuthInitialized,
  selectIsAuthenticated,
} from './store/features/auth/authSlice';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectAuthInitialized);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (isAuthenticated) {
      router.replace('/admin/users');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  return null;
}

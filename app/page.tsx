'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectIsAuthenticated } from './store/features/auth/authSlice';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin/users');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return null;
}

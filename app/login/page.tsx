'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  sendOtpStart,
  verifyOtpStart,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../../store/features/auth/authSlice';

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin/users');
    }
  }, [isAuthenticated, router]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(sendOtpStart({ mobileNumber }));
    setShowOtpForm(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(verifyOtpStart({ mobileNumber, otp }));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!showOtpForm ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="text"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

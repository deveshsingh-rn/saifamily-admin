'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  sendOtpStart,
  verifyOtpStart,
  loginStart,
  registerStart,
  clearAuthError,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectRegistrationSuccess,
  clearRegistrationSuccess,
} from '../store/features/auth/authSlice';

type AuthMode = 'mobile' | 'email';
type EmailMode = 'login' | 'register';

const LoginPage = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('mobile');
  const [emailMode, setEmailMode] = useState<EmailMode>('login');

  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [showOtpForm, setShowOtpForm] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const registrationSuccess = useSelector(selectRegistrationSuccess);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/admin/users');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (registrationSuccess) {
      dispatch(clearRegistrationSuccess());
      router.push('/account/create');
    }
  }, [registrationSuccess, dispatch, router]);

  const handleSwitchAuthMode = (mode: AuthMode) => {
    dispatch(clearAuthError());
    setAuthMode(mode);
    if (mode === 'mobile') {
      setShowOtpForm(false);
    }
  };

  const handleSwitchEmailMode = (mode: EmailMode) => {
    dispatch(clearAuthError());
    setEmailMode(mode);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(sendOtpStart({ mobileNumber }));
    setShowOtpForm(true);
  };

  const handleVerifyOtp = (e: React.FormEveznt) => {
    e.preventDefault();
    dispatch(verifyOtpStart({ mobileNumber, otp }));
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart({ email, password }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerStart({ name, email, password }));
  };

  const renderMobileForm = () => (
    <>
      {!showOtpForm ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              placeholder="Enter the OTP"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
    </>
  );

  const renderEmailForm = () => {
    if (emailMode === 'login') {
      return (
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleRegister} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Create Account'}
        </button>
      </form>
    );
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">Admin Login</h1>
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => handleSwitchAuthMode('mobile')}
            className={`w-1/2 py-4 text-center font-medium text-sm ${authMode === 'mobile' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Mobile
          </button>
          <button
            onClick={() => handleSwitchAuthMode('email')}
            className={`w-1/2 py-4 text-center font-medium text-sm ${authMode === 'email' ? 'text-indigo-600 border-b-2 border-indigo-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Email
          </button>
        </div>

        {authMode === 'mobile' ? (
          <div className="pt-4">{renderMobileForm()}</div>
        ) : (
          <div className="pt-4">
            <div className="flex justify-center mb-4 rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => handleSwitchEmailMode('login')}
                className={`px-4 py-2 text-sm font-medium ${emailMode === 'login' ? 'text-white bg-indigo-600' : 'text-gray-900 bg-white hover:bg-gray-50'} border border-gray-200 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-indigo-500`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleSwitchEmailMode('register')}
                className={`px-4 py-2 text-sm font-medium ${emailMode === 'register' ? 'text-white bg-indigo-600' : 'text-gray-900 bg-white hover:bg-gray-50'} border border-gray-200 rounded-r-lg focus:z-10 focus:ring-2 focus:ring-indigo-500`}
              >
                Register
              </button>
            </div>
            {renderEmailForm()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  clearAuthSession,
  notifyForbidden,
  notifySessionExpired,
  readAuthSession,
  updateStoredTokens,
} from '@/app/services/authSession';

const configuredApiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000/api';

// Existing API modules include `/api` in their endpoint paths.
const apiOrigin = configuredApiBaseUrl.replace(/\/api\/?$/, '');

interface RefreshTokenResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: apiOrigin,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: apiOrigin,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const session = readAuthSession();

  if (!session?.refreshToken) {
    throw new Error('Refresh token is unavailable');
  }

  const response = await refreshClient.post<RefreshTokenResponse>(
    '/api/auth/refresh-token',
    { refreshToken: session.refreshToken },
  );

  updateStoredTokens(
    response.data.tokens.accessToken,
    response.data.tokens.refreshToken,
  );

  return response.data.tokens.accessToken;
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = readAuthSession()?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? '';
    const isAuthRequest =
      requestUrl.includes('/api/auth/refresh-token') ||
      requestUrl.includes('/api/auth/logout') ||
      requestUrl.includes('/api/auth/mobile/verify-otp') ||
      requestUrl.includes('/api/auth/email/login');

    if (error.response?.status === 403) {
      notifyForbidden();
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });

      const accessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuthSession();
      notifySessionExpired();
      return Promise.reject(refreshError);
    }
  },
);

export { axiosInstance };

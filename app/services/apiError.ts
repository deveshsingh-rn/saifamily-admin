import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/adminApi';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const responseError = axiosError.response?.data?.error;

  return (
    axiosError.response?.data?.message ||
    (typeof responseError === 'string' ? responseError : responseError?.message) ||
    axiosError.message ||
    fallback
  );
}

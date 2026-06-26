export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastPayload {
  id?: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
}

export const APP_TOAST_EVENT = 'app:toast';

export function showToast(payload: ToastPayload): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<ToastPayload>(APP_TOAST_EVENT, {
      detail: {
        id: crypto.randomUUID(),
        variant: 'info',
        ...payload,
      },
    }),
  );
}


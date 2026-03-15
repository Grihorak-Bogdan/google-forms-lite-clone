import { useState } from 'react';

export type Notification = { type: 'success' | 'error'; text: string } | null;

export function useNotification() {
  const [notification, setNotification] = useState<Notification>(null);

  const showNotification = (type: 'success' | 'error', text: string, timeout = 4000) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), timeout);
  };

  return {
    notification,
    showNotification,
  };
}

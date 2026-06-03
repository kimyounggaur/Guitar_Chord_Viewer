import { useCallback, useEffect, useState } from 'react';
import { isValidAdminLogin } from '../lib/adminAuth';

const adminSessionKey = 'guitar-chord-viewer-admin-session';

function readStoredSession() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(adminSessionKey) === 'true';
  } catch {
    return false;
  }
}

export function useAdminSession() {
  const [isAdmin, setIsAdmin] = useState(readStoredSession);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(adminSessionKey, isAdmin ? 'true' : 'false');
    } catch {
      // The admin gate still works for the current session when storage is unavailable.
    }
  }, [isAdmin]);

  const login = useCallback((id: string, password: string) => {
    const ok = isValidAdminLogin(id, password, {
      id: import.meta.env.VITE_ADMIN_ID,
      password: import.meta.env.VITE_ADMIN_PASSWORD,
    });

    if (!ok) {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
      return false;
    }

    setIsAdmin(true);
    setLoginError(null);
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setLoginError(null);
  }, []);

  return {
    isAdmin,
    loginError,
    login,
    logout,
  };
}

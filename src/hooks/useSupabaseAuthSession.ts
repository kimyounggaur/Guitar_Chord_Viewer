import type { Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase, supabaseConfigError } from '../lib/supabaseClient';

type AuthRole = 'guest' | 'member' | 'admin';

type ProfileRoleRecord = {
  role: string | null;
};

const authMessages = {
  configMissing: 'Supabase 연결 정보가 없습니다. 환경변수를 설정해주세요.',
  invalidEmail: '이메일 형식으로 입력해주세요.',
  missingPassword: '비밀번호를 입력해주세요.',
  shortPassword: '비밀번호는 6자 이상 입력해주세요.',
  invalidLogin: '이메일 또는 비밀번호가 올바르지 않습니다.',
  adminOnly: '관리자 권한이 있는 계정만 로그인할 수 있습니다.',
  emailConfirmation: '회원가입이 완료되었습니다. 이메일 확인 후 로그인해주세요.',
} as const;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getUserLabel(user: User | null) {
  return user?.email ?? null;
}

function getAppMetadataRole(user: User): AuthRole | null {
  const role = user.app_metadata?.role;
  return role === 'admin' || role === 'member' ? role : null;
}

async function resolveUserRole(user: User): Promise<AuthRole> {
  const metadataRole = getAppMetadataRole(user);
  if (metadataRole) {
    return metadataRole;
  }

  if (!supabase) {
    return 'member';
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<ProfileRoleRecord>();

  if (error) {
    return 'member';
  }

  return data?.role === 'admin' ? 'admin' : 'member';
}

function validateEmailPassword(email: string, password: string, requireLongPassword = false) {
  const normalizedEmail = normalizeEmail(email);

  if (!isEmail(normalizedEmail)) {
    return {
      ok: false,
      error: authMessages.invalidEmail,
      email: normalizedEmail,
    } as const;
  }

  if (!password) {
    return {
      ok: false,
      error: authMessages.missingPassword,
      email: normalizedEmail,
    } as const;
  }

  if (requireLongPassword && password.length < 6) {
    return {
      ok: false,
      error: authMessages.shortPassword,
      email: normalizedEmail,
    } as const;
  }

  return {
    ok: true,
    email: normalizedEmail,
  } as const;
}

export function useSupabaseAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AuthRole>('guest');
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupMessage, setSignupMessage] = useState<string | null>(null);

  const applySession = useCallback(async (nextSession: Session | null) => {
    setSession(nextSession);

    if (!nextSession?.user) {
      setRole('guest');
      return;
    }

    setRole(await resolveUserRole(nextSession.user));
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const client = supabase;
    let cancelled = false;

    const loadSession = async () => {
      const { data, error } = await client.auth.getSession();
      if (cancelled) {
        return;
      }

      if (error) {
        setLoginError(error.message);
      }

      await applySession(data.session);
      setIsLoading(false);
    };

    void loadSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      void applySession(nextSession);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const signup = useCallback(async (emailInput: string, password: string) => {
    setSignupError(null);
    setSignupMessage(null);
    setLoginError(null);
    setAdminError(null);

    if (!supabase) {
      setSignupError(authMessages.configMissing);
      return false;
    }

    const validation = validateEmailPassword(emailInput, password, true);
    if (!validation.ok) {
      setSignupError(validation.error);
      return false;
    }

    const { data, error } = await supabase.auth.signUp({
      email: validation.email,
      password,
    });

    if (error) {
      setSignupError(error.message);
      return false;
    }

    if (data.session) {
      await applySession(data.session);
      return true;
    }

    setSignupMessage(authMessages.emailConfirmation);
    return false;
  }, [applySession]);

  const login = useCallback(async (emailInput: string, password: string) => {
    setLoginError(null);
    setSignupError(null);
    setSignupMessage(null);
    setAdminError(null);

    if (!supabase) {
      setLoginError(authMessages.configMissing);
      return false;
    }

    const validation = validateEmailPassword(emailInput, password);
    if (!validation.ok) {
      setLoginError(validation.error);
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validation.email,
      password,
    });

    if (error) {
      setLoginError(error.message || authMessages.invalidLogin);
      return false;
    }

    if (data.session) {
      await applySession(data.session);
    }

    return true;
  }, [applySession]);

  const adminLogin = useCallback(async (emailInput: string, password: string) => {
    setAdminError(null);
    setLoginError(null);
    setSignupError(null);
    setSignupMessage(null);

    if (!supabase) {
      setAdminError(authMessages.configMissing);
      return false;
    }

    const validation = validateEmailPassword(emailInput, password);
    if (!validation.ok) {
      setAdminError(validation.error);
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validation.email,
      password,
    });

    if (error || !data.session?.user) {
      setAdminError(error?.message || authMessages.invalidLogin);
      return false;
    }

    const nextRole = await resolveUserRole(data.session.user);
    if (nextRole !== 'admin') {
      setAdminError(authMessages.adminOnly);
      await supabase.auth.signOut();
      await applySession(null);
      return false;
    }

    await applySession(data.session);
    return true;
  }, [applySession]);

  const logout = useCallback(async () => {
    setLoginError(null);
    setSignupError(null);
    setSignupMessage(null);
    setAdminError(null);

    if (supabase) {
      await supabase.auth.signOut();
    }

    await applySession(null);
  }, [applySession]);

  return {
    authConfigError: supabaseConfigError,
    isLoading,
    isMember: role === 'member' || role === 'admin',
    isAdmin: role === 'admin',
    memberId: getUserLabel(session?.user ?? null),
    loginError,
    adminError,
    signupError,
    signupMessage,
    signup,
    login,
    adminLogin,
    logout,
  };
}

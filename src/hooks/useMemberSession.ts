import { useCallback, useEffect, useState } from 'react';
import {
  createMemberAccount,
  findMemberAccount,
  isValidMemberLogin,
  memberAuthMessages,
  parseStoredMemberAccounts,
  type MemberAccount,
} from '../lib/memberAuth';

const memberAccountsKey = 'guitar-chord-viewer-member-accounts';
const memberSessionKey = 'guitar-chord-viewer-member-session';

type MemberSessionState = {
  accounts: MemberAccount[];
  memberId: string | null;
};

function readStoredAccounts() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return parseStoredMemberAccounts(window.localStorage.getItem(memberAccountsKey));
  } catch {
    return [];
  }
}

function readStoredMemberId(accounts: MemberAccount[]) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const id = window.localStorage.getItem(memberSessionKey);
    return id && findMemberAccount(accounts, id) ? id : null;
  } catch {
    return null;
  }
}

function readInitialState(): MemberSessionState {
  const accounts = readStoredAccounts();

  return {
    accounts,
    memberId: readStoredMemberId(accounts),
  };
}

export function useMemberSession() {
  const [{ accounts, memberId }, setSessionState] = useState(readInitialState);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(memberAccountsKey, JSON.stringify(accounts));
      if (memberId) {
        window.localStorage.setItem(memberSessionKey, memberId);
      } else {
        window.localStorage.removeItem(memberSessionKey);
      }
    } catch {
      // The member gate still works for the current session when storage is unavailable.
    }
  }, [accounts, memberId]);

  const signup = useCallback(
    (id: string, password: string) => {
      const result = createMemberAccount(accounts, id, password);

      if (!result.ok) {
        setSignupError(result.error);
        setLoginError(null);
        return false;
      }

      setSessionState({
        accounts: result.accounts,
        memberId: result.account.id,
      });
      setSignupError(null);
      setLoginError(null);
      return true;
    },
    [accounts],
  );

  const login = useCallback(
    (id: string, password: string) => {
      if (!isValidMemberLogin(accounts, id, password)) {
        setLoginError(memberAuthMessages.invalidLogin);
        setSignupError(null);
        return false;
      }

      const account = findMemberAccount(accounts, id);
      setSessionState({
        accounts,
        memberId: account?.id ?? null,
      });
      setLoginError(null);
      setSignupError(null);
      return true;
    },
    [accounts],
  );

  const logout = useCallback(() => {
    setSessionState((current) => ({
      accounts: current.accounts,
      memberId: null,
    }));
    setLoginError(null);
    setSignupError(null);
  }, []);

  return {
    isMember: Boolean(memberId),
    memberId,
    loginError,
    signupError,
    signup,
    login,
    logout,
  };
}

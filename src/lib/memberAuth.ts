export type MemberAccount = {
  id: string;
  password: string;
  createdAt: string;
};

export const memberAuthMessages = {
  missingId: '아이디를 입력해주세요.',
  shortId: '아이디는 3자 이상 입력해주세요.',
  missingPassword: '비밀번호를 입력해주세요.',
  shortPassword: '비밀번호는 4자 이상 입력해주세요.',
  duplicateId: '이미 등록된 아이디입니다.',
  invalidLogin: '아이디 또는 비밀번호가 올바르지 않습니다.',
} as const;

export function normalizeMemberId(id: string) {
  return id.trim();
}

function isMemberAccount(value: unknown): value is MemberAccount {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const account = value as Partial<MemberAccount>;
  return (
    typeof account.id === 'string' &&
    typeof account.password === 'string' &&
    typeof account.createdAt === 'string'
  );
}

export function parseStoredMemberAccounts(value: string | null): MemberAccount[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(isMemberAccount) : [];
  } catch {
    return [];
  }
}

export function findMemberAccount(accounts: MemberAccount[], id: string) {
  const normalizedId = normalizeMemberId(id).toLowerCase();
  return accounts.find((account) => account.id.toLowerCase() === normalizedId) ?? null;
}

type SignupResult =
  | {
      ok: true;
      account: MemberAccount;
      accounts: MemberAccount[];
    }
  | {
      ok: false;
      error: string;
      accounts: MemberAccount[];
    };

export function createMemberAccount(
  accounts: MemberAccount[],
  id: string,
  password: string,
  now: () => string = () => new Date().toISOString(),
): SignupResult {
  const normalizedId = normalizeMemberId(id);

  if (!normalizedId) {
    return { ok: false, error: memberAuthMessages.missingId, accounts };
  }

  if (normalizedId.length < 3) {
    return { ok: false, error: memberAuthMessages.shortId, accounts };
  }

  if (!password) {
    return { ok: false, error: memberAuthMessages.missingPassword, accounts };
  }

  if (password.length < 4) {
    return { ok: false, error: memberAuthMessages.shortPassword, accounts };
  }

  if (findMemberAccount(accounts, normalizedId)) {
    return { ok: false, error: memberAuthMessages.duplicateId, accounts };
  }

  const account = {
    id: normalizedId,
    password,
    createdAt: now(),
  };

  return {
    ok: true,
    account,
    accounts: [...accounts, account],
  };
}

export function isValidMemberLogin(accounts: MemberAccount[], id: string, password: string) {
  const account = findMemberAccount(accounts, id);
  return Boolean(account && account.password === password);
}

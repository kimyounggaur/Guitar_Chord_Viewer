import { describe, expect, it } from 'vitest';
import {
  createMemberAccount,
  findMemberAccount,
  isValidMemberLogin,
  memberAuthMessages,
  parseStoredMemberAccounts,
} from './memberAuth';

describe('member auth helpers', () => {
  it('creates a trimmed member account with a timestamp', () => {
    const result = createMemberAccount([], '  player01  ', 'pick1234', () => '2026-06-04T00:00:00.000Z');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.account).toEqual({
        id: 'player01',
        password: 'pick1234',
        createdAt: '2026-06-04T00:00:00.000Z',
      });
      expect(result.accounts).toHaveLength(1);
    }
  });

  it('rejects duplicate member ids without case sensitivity', () => {
    const existing = [{ id: 'Player01', password: 'pick1234', createdAt: '2026-06-04T00:00:00.000Z' }];
    const result = createMemberAccount(existing, 'player01', 'newpass');

    expect(result).toEqual({
      ok: false,
      error: memberAuthMessages.duplicateId,
      accounts: existing,
    });
  });

  it('validates member login by trimmed id and exact password', () => {
    const accounts = [{ id: 'member', password: 'lesson', createdAt: '2026-06-04T00:00:00.000Z' }];

    expect(findMemberAccount(accounts, ' MEMBER ')?.id).toBe('member');
    expect(isValidMemberLogin(accounts, ' member ', 'lesson')).toBe(true);
    expect(isValidMemberLogin(accounts, 'member', ' lesson ')).toBe(false);
  });

  it('ignores invalid stored account records', () => {
    const stored = JSON.stringify([{ id: 'ok', password: '1234', createdAt: 'now' }, { id: 'bad' }]);

    expect(parseStoredMemberAccounts(stored)).toEqual([{ id: 'ok', password: '1234', createdAt: 'now' }]);
    expect(parseStoredMemberAccounts('not-json')).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import { defaultAdminCredentials, isValidAdminLogin, resolveAdminCredentials } from './adminAuth';

describe('admin auth helpers', () => {
  it('uses default credentials when environment values are empty', () => {
    expect(resolveAdminCredentials({ id: '', password: '' })).toEqual(defaultAdminCredentials);
  });

  it('validates the configured admin id and password', () => {
    expect(isValidAdminLogin('manager', 'secret-123', { id: 'manager', password: 'secret-123' })).toBe(true);
    expect(isValidAdminLogin('manager', 'wrong', { id: 'manager', password: 'secret-123' })).toBe(false);
  });

  it('trims the id while preserving the exact password', () => {
    expect(isValidAdminLogin('  admin  ', defaultAdminCredentials.password)).toBe(true);
    expect(isValidAdminLogin('admin', ` ${defaultAdminCredentials.password} `)).toBe(false);
  });
});

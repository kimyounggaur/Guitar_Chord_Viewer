import { describe, expect, it } from 'vitest';
import { fingerName } from './fingerLabels';

describe('fingerName', () => {
  it('maps chord finger numbers to Korean names', () => {
    expect(fingerName(1)).toBe('검지');
    expect(fingerName(2)).toBe('중지');
    expect(fingerName(3)).toBe('약지');
    expect(fingerName(4)).toBe('소지');
  });
});


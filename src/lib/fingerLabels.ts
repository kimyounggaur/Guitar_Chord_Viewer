import type { FingerNumber } from '../data/chordTypes';

const fingerNames: Record<FingerNumber, string> = {
  1: '검지',
  2: '중지',
  3: '약지',
  4: '소지',
};

export function fingerName(finger: FingerNumber): string {
  return fingerNames[finger];
}


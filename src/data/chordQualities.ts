import type { ChordQualityId } from './chordTypes';

export type ChordQuality = {
  id: ChordQualityId;
  label: string;
  color: string;
  borderColorClass: string;
  textColorClass: string;
  description: string;
};

export const chordQualities: ChordQuality[] = [
  {
    id: 'major',
    label: 'Major',
    color: '#f97316',
    borderColorClass: 'border-orange-500',
    textColorClass: 'text-rose-800',
    description: '밝고 안정적인 기본 메이저 코드',
  },
  {
    id: 'dominant7',
    label: '7',
    color: '#facc15',
    borderColorClass: 'border-yellow-300',
    textColorClass: 'text-yellow-600',
    description: '블루스와 팝에서 자주 쓰는 도미넌트 세븐',
  },
  {
    id: 'minor',
    label: 'minor',
    color: '#bef264',
    borderColorClass: 'border-lime-300',
    textColorClass: 'text-lime-600',
    description: '어둡고 감성적인 마이너 코드',
  },
  {
    id: 'minor7',
    label: 'minor7',
    color: '#10b981',
    borderColorClass: 'border-emerald-400',
    textColorClass: 'text-emerald-600',
    description: '부드러운 재즈와 팝 느낌의 마이너 세븐',
  },
  {
    id: 'sus4',
    label: 'sus4',
    color: '#22d3ee',
    borderColorClass: 'border-cyan-400',
    textColorClass: 'text-cyan-600',
    description: '긴장감 있게 매달리는 suspended 코드',
  },
  {
    id: 'major7',
    label: 'Major 7',
    color: '#0ea5e9',
    borderColorClass: 'border-sky-500',
    textColorClass: 'text-sky-700',
    description: '몽환적이고 세련된 메이저 세븐',
  },
  {
    id: 'six',
    label: '6',
    color: '#1e3a8a',
    borderColorClass: 'border-blue-900',
    textColorClass: 'text-blue-900',
    description: '빈티지하고 따뜻한 식스 코드',
  },
  {
    id: 'sevenSus4',
    label: '7sus4',
    color: '#8b5cf6',
    borderColorClass: 'border-violet-400',
    textColorClass: 'text-violet-700',
    description: '도미넌트와 sus4의 긴장감을 함께 담은 코드',
  },
  {
    id: 'add2',
    label: 'add2',
    color: '#fda4af',
    borderColorClass: 'border-rose-200',
    textColorClass: 'text-rose-400',
    description: '2음을 더해 맑은 느낌을 주는 코드',
  },
  {
    id: 'm7b5',
    label: 'm7(b5)',
    color: '#f0abfc',
    borderColorClass: 'border-fuchsia-300',
    textColorClass: 'text-fuchsia-600',
    description: '하프 디미니시드 코드',
  },
  {
    id: 'diminish',
    label: 'diminish',
    color: '#a855f7',
    borderColorClass: 'border-purple-600',
    textColorClass: 'text-purple-800',
    description: '긴장감이 강한 디미니시드 코드',
  },
  {
    id: 'augment',
    label: 'Augment',
    color: '#a16207',
    borderColorClass: 'border-yellow-700',
    textColorClass: 'text-rose-800',
    description: '증5도를 가진 증화음 코드',
  },
];

export function getChordQuality(id: ChordQualityId): ChordQuality {
  const quality = chordQualities.find((item) => item.id === id);
  if (!quality) {
    throw new Error(`Unknown chord quality: ${id}`);
  }

  return quality;
}
